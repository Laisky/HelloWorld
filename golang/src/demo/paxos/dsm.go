package paxos

import "sync"

// State paxos-replica's state
type State string

type Next func(State) (State, Next)

// Proposal that sent from Client to Replica
type Proposal struct {
	k   int                       // cliend id
	cid int                       // client local transaction id
	op  func(State) (State, Next) // operation
}

// Action store in slots
type Action struct {
	slotNum  int
	proposal Proposal
}

type Replica struct {
	*sync.Mutex
	state                State
	slotNum              int
	proposals, decisions []*Action
	leaders              []interface{}
}

func IsProposalEqual(p1, p2 Proposal) bool {
	if p1.cid == p2.cid &&
		p1.k == p2.k {
		return true
	}

	return false
}

// Send proposal to reciever
func Send(receiver, data interface{}) {}

// NewReplica initial new replica
func NewReplica(leaders []interface{}, initState State) *Replica {
	return &Replica{
		state:   initState,
		leaders: leaders,
		Mutex:   &sync.Mutex{},
	}
}

// propose response for proposol
func (r *Replica) propose(p Proposal) {
	// check whether p already been proposed
	for _, pp := range r.decisions {
		if IsProposalEqual(pp.proposal, p) {
			return
		}
	}

	// p not exists in decisions.
	// find the lowest unused slot to put p.
	s := -1
NEXT_SLOT:
	s++
	for _, pp := range r.proposals {
		if pp.slotNum == s {
			goto NEXT_SLOT
		}
	}

	for _, pp := range r.decisions {
		if pp.slotNum == s {
			goto NEXT_SLOT
		}
	}

	r.proposals = append(r.proposals, &Action{
		slotNum:  s,
		proposal: p,
	})

	for _, l := range r.leaders {
		Send(l, p)
	}
	return
}

// perform deal with proposal
func (r *Replica) perform(p Proposal) {
	for _, dp := range r.decisions {
		if IsProposalEqual(dp.proposal, p) && dp.slotNum < r.slotNum {
			r.slotNum++
			return
		}
	}

	next, result := p.op(r.state)
	r.Lock()
	r.state = next
	r.slotNum++
	r.Unlock()

	// send response to client
	Send(p.k, []interface{}{"response", p.cid, result})
}

type Request struct {
	p Proposal
}

type Decision struct {
	slotNum int
	p       Proposal
}

func Receive() interface{} {
	return nil
}

// Start running replica
func (r *Replica) Start() {
	for {
		switch req := Receive().(type) {
		case Request:
			r.propose(req.p)
		case Decision:
			r.decisions = append(r.decisions, &Action{
				slotNum:  req.slotNum,
				proposal: req.p,
			})

			for _, dp := range r.decisions {
				if dp.slotNum == r.slotNum {
					for _, pp := range r.proposals {
						if pp.slotNum == r.slotNum &&
							!IsProposalEqual(dp.proposal, pp.proposal) {
							r.propose(pp.proposal)
						}
					}

					r.perform(dp.proposal)
				}
			}
		}
	}
}
