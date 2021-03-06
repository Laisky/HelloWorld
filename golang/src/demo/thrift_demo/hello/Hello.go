// Autogenerated by Thrift Compiler (0.11.0)
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING

package hello

import (
	"bytes"
	"context"
	"fmt"
	"reflect"

	"git.apache.org/thrift.git/lib/go/thrift"
)

// (needed to ensure safety because of naive import list construction.)
var _ = thrift.ZERO
var _ = fmt.Printf
var _ = context.Background
var _ = reflect.DeepEqual
var _ = bytes.Equal

type Hello interface {
	// Parameters:
	//  - Para
	HelloString(ctx context.Context, para string) (r string, err error)
	// Parameters:
	//  - Para
	HelloInt(ctx context.Context, para int32) (r int32, err error)
	// Parameters:
	//  - Para
	HelloBoolean(ctx context.Context, para bool) (r bool, err error)
	HelloVoid(ctx context.Context) (err error)
	HelloNull(ctx context.Context) (r string, err error)
}

type HelloClient struct {
	c thrift.TClient
}

// Deprecated: Use NewHello instead
func NewHelloClientFactory(t thrift.TTransport, f thrift.TProtocolFactory) *HelloClient {
	return &HelloClient{
		c: thrift.NewTStandardClient(f.GetProtocol(t), f.GetProtocol(t)),
	}
}

// Deprecated: Use NewHello instead
func NewHelloClientProtocol(t thrift.TTransport, iprot thrift.TProtocol, oprot thrift.TProtocol) *HelloClient {
	return &HelloClient{
		c: thrift.NewTStandardClient(iprot, oprot),
	}
}

func NewHelloClient(c thrift.TClient) *HelloClient {
	return &HelloClient{
		c: c,
	}
}

// Parameters:
//  - Para
func (p *HelloClient) HelloString(ctx context.Context, para string) (r string, err error) {
	var _args0 HelloHelloStringArgs
	_args0.Para = para
	var _result1 HelloHelloStringResult
	if err = p.c.Call(ctx, "helloString", &_args0, &_result1); err != nil {
		return
	}
	return _result1.GetSuccess(), nil
}

// Parameters:
//  - Para
func (p *HelloClient) HelloInt(ctx context.Context, para int32) (r int32, err error) {
	var _args2 HelloHelloIntArgs
	_args2.Para = para
	var _result3 HelloHelloIntResult
	if err = p.c.Call(ctx, "helloInt", &_args2, &_result3); err != nil {
		return
	}
	return _result3.GetSuccess(), nil
}

// Parameters:
//  - Para
func (p *HelloClient) HelloBoolean(ctx context.Context, para bool) (r bool, err error) {
	var _args4 HelloHelloBooleanArgs
	_args4.Para = para
	var _result5 HelloHelloBooleanResult
	if err = p.c.Call(ctx, "helloBoolean", &_args4, &_result5); err != nil {
		return
	}
	return _result5.GetSuccess(), nil
}

func (p *HelloClient) HelloVoid(ctx context.Context) (err error) {
	var _args6 HelloHelloVoidArgs
	var _result7 HelloHelloVoidResult
	if err = p.c.Call(ctx, "helloVoid", &_args6, &_result7); err != nil {
		return
	}
	return nil
}

func (p *HelloClient) HelloNull(ctx context.Context) (r string, err error) {
	var _args8 HelloHelloNullArgs
	var _result9 HelloHelloNullResult
	if err = p.c.Call(ctx, "helloNull", &_args8, &_result9); err != nil {
		return
	}
	return _result9.GetSuccess(), nil
}

type HelloProcessor struct {
	processorMap map[string]thrift.TProcessorFunction
	handler      Hello
}

func (p *HelloProcessor) AddToProcessorMap(key string, processor thrift.TProcessorFunction) {
	p.processorMap[key] = processor
}

func (p *HelloProcessor) GetProcessorFunction(key string) (processor thrift.TProcessorFunction, ok bool) {
	processor, ok = p.processorMap[key]
	return processor, ok
}

func (p *HelloProcessor) ProcessorMap() map[string]thrift.TProcessorFunction {
	return p.processorMap
}

func NewHelloProcessor(handler Hello) *HelloProcessor {

	self10 := &HelloProcessor{handler: handler, processorMap: make(map[string]thrift.TProcessorFunction)}
	self10.processorMap["helloString"] = &helloProcessorHelloString{handler: handler}
	self10.processorMap["helloInt"] = &helloProcessorHelloInt{handler: handler}
	self10.processorMap["helloBoolean"] = &helloProcessorHelloBoolean{handler: handler}
	self10.processorMap["helloVoid"] = &helloProcessorHelloVoid{handler: handler}
	self10.processorMap["helloNull"] = &helloProcessorHelloNull{handler: handler}
	return self10
}

func (p *HelloProcessor) Process(ctx context.Context, iprot, oprot thrift.TProtocol) (success bool, err thrift.TException) {
	name, _, seqId, err := iprot.ReadMessageBegin()
	if err != nil {
		return false, err
	}
	if processor, ok := p.GetProcessorFunction(name); ok {
		return processor.Process(ctx, seqId, iprot, oprot)
	}
	iprot.Skip(thrift.STRUCT)
	iprot.ReadMessageEnd()
	x11 := thrift.NewTApplicationException(thrift.UNKNOWN_METHOD, "Unknown function "+name)
	oprot.WriteMessageBegin(name, thrift.EXCEPTION, seqId)
	x11.Write(oprot)
	oprot.WriteMessageEnd()
	oprot.Flush()
	return false, x11

}

type helloProcessorHelloString struct {
	handler Hello
}

func (p *helloProcessorHelloString) Process(ctx context.Context, seqId int32, iprot, oprot thrift.TProtocol) (success bool, err thrift.TException) {
	args := HelloHelloStringArgs{}
	if err = args.Read(iprot); err != nil {
		iprot.ReadMessageEnd()
		x := thrift.NewTApplicationException(thrift.PROTOCOL_ERROR, err.Error())
		oprot.WriteMessageBegin("helloString", thrift.EXCEPTION, seqId)
		x.Write(oprot)
		oprot.WriteMessageEnd()
		oprot.Flush()
		return false, err
	}

	iprot.ReadMessageEnd()
	result := HelloHelloStringResult{}
	var retval string
	var err2 error
	if retval, err2 = p.handler.HelloString(ctx, args.Para); err2 != nil {
		x := thrift.NewTApplicationException(thrift.INTERNAL_ERROR, "Internal error processing helloString: "+err2.Error())
		oprot.WriteMessageBegin("helloString", thrift.EXCEPTION, seqId)
		x.Write(oprot)
		oprot.WriteMessageEnd()
		oprot.Flush()
		return true, err2
	} else {
		result.Success = &retval
	}
	if err2 = oprot.WriteMessageBegin("helloString", thrift.REPLY, seqId); err2 != nil {
		err = err2
	}
	if err2 = result.Write(oprot); err == nil && err2 != nil {
		err = err2
	}
	if err2 = oprot.WriteMessageEnd(); err == nil && err2 != nil {
		err = err2
	}
	if err2 = oprot.Flush(); err == nil && err2 != nil {
		err = err2
	}
	if err != nil {
		return
	}
	return true, err
}

type helloProcessorHelloInt struct {
	handler Hello
}

func (p *helloProcessorHelloInt) Process(ctx context.Context, seqId int32, iprot, oprot thrift.TProtocol) (success bool, err thrift.TException) {
	args := HelloHelloIntArgs{}
	if err = args.Read(iprot); err != nil {
		iprot.ReadMessageEnd()
		x := thrift.NewTApplicationException(thrift.PROTOCOL_ERROR, err.Error())
		oprot.WriteMessageBegin("helloInt", thrift.EXCEPTION, seqId)
		x.Write(oprot)
		oprot.WriteMessageEnd()
		oprot.Flush()
		return false, err
	}

	iprot.ReadMessageEnd()
	result := HelloHelloIntResult{}
	var retval int32
	var err2 error
	if retval, err2 = p.handler.HelloInt(ctx, args.Para); err2 != nil {
		x := thrift.NewTApplicationException(thrift.INTERNAL_ERROR, "Internal error processing helloInt: "+err2.Error())
		oprot.WriteMessageBegin("helloInt", thrift.EXCEPTION, seqId)
		x.Write(oprot)
		oprot.WriteMessageEnd()
		oprot.Flush()
		return true, err2
	} else {
		result.Success = &retval
	}
	if err2 = oprot.WriteMessageBegin("helloInt", thrift.REPLY, seqId); err2 != nil {
		err = err2
	}
	if err2 = result.Write(oprot); err == nil && err2 != nil {
		err = err2
	}
	if err2 = oprot.WriteMessageEnd(); err == nil && err2 != nil {
		err = err2
	}
	if err2 = oprot.Flush(); err == nil && err2 != nil {
		err = err2
	}
	if err != nil {
		return
	}
	return true, err
}

type helloProcessorHelloBoolean struct {
	handler Hello
}

func (p *helloProcessorHelloBoolean) Process(ctx context.Context, seqId int32, iprot, oprot thrift.TProtocol) (success bool, err thrift.TException) {
	args := HelloHelloBooleanArgs{}
	if err = args.Read(iprot); err != nil {
		iprot.ReadMessageEnd()
		x := thrift.NewTApplicationException(thrift.PROTOCOL_ERROR, err.Error())
		oprot.WriteMessageBegin("helloBoolean", thrift.EXCEPTION, seqId)
		x.Write(oprot)
		oprot.WriteMessageEnd()
		oprot.Flush()
		return false, err
	}

	iprot.ReadMessageEnd()
	result := HelloHelloBooleanResult{}
	var retval bool
	var err2 error
	if retval, err2 = p.handler.HelloBoolean(ctx, args.Para); err2 != nil {
		x := thrift.NewTApplicationException(thrift.INTERNAL_ERROR, "Internal error processing helloBoolean: "+err2.Error())
		oprot.WriteMessageBegin("helloBoolean", thrift.EXCEPTION, seqId)
		x.Write(oprot)
		oprot.WriteMessageEnd()
		oprot.Flush()
		return true, err2
	} else {
		result.Success = &retval
	}
	if err2 = oprot.WriteMessageBegin("helloBoolean", thrift.REPLY, seqId); err2 != nil {
		err = err2
	}
	if err2 = result.Write(oprot); err == nil && err2 != nil {
		err = err2
	}
	if err2 = oprot.WriteMessageEnd(); err == nil && err2 != nil {
		err = err2
	}
	if err2 = oprot.Flush(); err == nil && err2 != nil {
		err = err2
	}
	if err != nil {
		return
	}
	return true, err
}

type helloProcessorHelloVoid struct {
	handler Hello
}

func (p *helloProcessorHelloVoid) Process(ctx context.Context, seqId int32, iprot, oprot thrift.TProtocol) (success bool, err thrift.TException) {
	args := HelloHelloVoidArgs{}
	if err = args.Read(iprot); err != nil {
		iprot.ReadMessageEnd()
		x := thrift.NewTApplicationException(thrift.PROTOCOL_ERROR, err.Error())
		oprot.WriteMessageBegin("helloVoid", thrift.EXCEPTION, seqId)
		x.Write(oprot)
		oprot.WriteMessageEnd()
		oprot.Flush()
		return false, err
	}

	iprot.ReadMessageEnd()
	result := HelloHelloVoidResult{}
	var err2 error
	if err2 = p.handler.HelloVoid(ctx); err2 != nil {
		x := thrift.NewTApplicationException(thrift.INTERNAL_ERROR, "Internal error processing helloVoid: "+err2.Error())
		oprot.WriteMessageBegin("helloVoid", thrift.EXCEPTION, seqId)
		x.Write(oprot)
		oprot.WriteMessageEnd()
		oprot.Flush()
		return true, err2
	}
	if err2 = oprot.WriteMessageBegin("helloVoid", thrift.REPLY, seqId); err2 != nil {
		err = err2
	}
	if err2 = result.Write(oprot); err == nil && err2 != nil {
		err = err2
	}
	if err2 = oprot.WriteMessageEnd(); err == nil && err2 != nil {
		err = err2
	}
	if err2 = oprot.Flush(); err == nil && err2 != nil {
		err = err2
	}
	if err != nil {
		return
	}
	return true, err
}

type helloProcessorHelloNull struct {
	handler Hello
}

func (p *helloProcessorHelloNull) Process(ctx context.Context, seqId int32, iprot, oprot thrift.TProtocol) (success bool, err thrift.TException) {
	args := HelloHelloNullArgs{}
	if err = args.Read(iprot); err != nil {
		iprot.ReadMessageEnd()
		x := thrift.NewTApplicationException(thrift.PROTOCOL_ERROR, err.Error())
		oprot.WriteMessageBegin("helloNull", thrift.EXCEPTION, seqId)
		x.Write(oprot)
		oprot.WriteMessageEnd()
		oprot.Flush()
		return false, err
	}

	iprot.ReadMessageEnd()
	result := HelloHelloNullResult{}
	var retval string
	var err2 error
	if retval, err2 = p.handler.HelloNull(ctx); err2 != nil {
		x := thrift.NewTApplicationException(thrift.INTERNAL_ERROR, "Internal error processing helloNull: "+err2.Error())
		oprot.WriteMessageBegin("helloNull", thrift.EXCEPTION, seqId)
		x.Write(oprot)
		oprot.WriteMessageEnd()
		oprot.Flush()
		return true, err2
	} else {
		result.Success = &retval
	}
	if err2 = oprot.WriteMessageBegin("helloNull", thrift.REPLY, seqId); err2 != nil {
		err = err2
	}
	if err2 = result.Write(oprot); err == nil && err2 != nil {
		err = err2
	}
	if err2 = oprot.WriteMessageEnd(); err == nil && err2 != nil {
		err = err2
	}
	if err2 = oprot.Flush(); err == nil && err2 != nil {
		err = err2
	}
	if err != nil {
		return
	}
	return true, err
}

// HELPER FUNCTIONS AND STRUCTURES

// Attributes:
//  - Para
type HelloHelloStringArgs struct {
	Para string `thrift:"para,1" db:"para" json:"para"`
}

func NewHelloHelloStringArgs() *HelloHelloStringArgs {
	return &HelloHelloStringArgs{}
}

func (p *HelloHelloStringArgs) GetPara() string {
	return p.Para
}
func (p *HelloHelloStringArgs) Read(iprot thrift.TProtocol) error {
	if _, err := iprot.ReadStructBegin(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read error: ", p), err)
	}

	for {
		_, fieldTypeId, fieldId, err := iprot.ReadFieldBegin()
		if err != nil {
			return thrift.PrependError(fmt.Sprintf("%T field %d read error: ", p, fieldId), err)
		}
		if fieldTypeId == thrift.STOP {
			break
		}
		switch fieldId {
		case 1:
			if fieldTypeId == thrift.STRING {
				if err := p.ReadField1(iprot); err != nil {
					return err
				}
			} else {
				if err := iprot.Skip(fieldTypeId); err != nil {
					return err
				}
			}
		default:
			if err := iprot.Skip(fieldTypeId); err != nil {
				return err
			}
		}
		if err := iprot.ReadFieldEnd(); err != nil {
			return err
		}
	}
	if err := iprot.ReadStructEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
	}
	return nil
}

func (p *HelloHelloStringArgs) ReadField1(iprot thrift.TProtocol) error {
	if v, err := iprot.ReadString(); err != nil {
		return thrift.PrependError("error reading field 1: ", err)
	} else {
		p.Para = v
	}
	return nil
}

func (p *HelloHelloStringArgs) Write(oprot thrift.TProtocol) error {
	if err := oprot.WriteStructBegin("helloString_args"); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
	}
	if p != nil {
		if err := p.writeField1(oprot); err != nil {
			return err
		}
	}
	if err := oprot.WriteFieldStop(); err != nil {
		return thrift.PrependError("write field stop error: ", err)
	}
	if err := oprot.WriteStructEnd(); err != nil {
		return thrift.PrependError("write struct stop error: ", err)
	}
	return nil
}

func (p *HelloHelloStringArgs) writeField1(oprot thrift.TProtocol) (err error) {
	if err := oprot.WriteFieldBegin("para", thrift.STRING, 1); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write field begin error 1:para: ", p), err)
	}
	if err := oprot.WriteString(string(p.Para)); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T.para (1) field write error: ", p), err)
	}
	if err := oprot.WriteFieldEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write field end error 1:para: ", p), err)
	}
	return err
}

func (p *HelloHelloStringArgs) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("HelloHelloStringArgs(%+v)", *p)
}

// Attributes:
//  - Success
type HelloHelloStringResult struct {
	Success *string `thrift:"success,0" db:"success" json:"success,omitempty"`
}

func NewHelloHelloStringResult() *HelloHelloStringResult {
	return &HelloHelloStringResult{}
}

var HelloHelloStringResult_Success_DEFAULT string

func (p *HelloHelloStringResult) GetSuccess() string {
	if !p.IsSetSuccess() {
		return HelloHelloStringResult_Success_DEFAULT
	}
	return *p.Success
}
func (p *HelloHelloStringResult) IsSetSuccess() bool {
	return p.Success != nil
}

func (p *HelloHelloStringResult) Read(iprot thrift.TProtocol) error {
	if _, err := iprot.ReadStructBegin(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read error: ", p), err)
	}

	for {
		_, fieldTypeId, fieldId, err := iprot.ReadFieldBegin()
		if err != nil {
			return thrift.PrependError(fmt.Sprintf("%T field %d read error: ", p, fieldId), err)
		}
		if fieldTypeId == thrift.STOP {
			break
		}
		switch fieldId {
		case 0:
			if fieldTypeId == thrift.STRING {
				if err := p.ReadField0(iprot); err != nil {
					return err
				}
			} else {
				if err := iprot.Skip(fieldTypeId); err != nil {
					return err
				}
			}
		default:
			if err := iprot.Skip(fieldTypeId); err != nil {
				return err
			}
		}
		if err := iprot.ReadFieldEnd(); err != nil {
			return err
		}
	}
	if err := iprot.ReadStructEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
	}
	return nil
}

func (p *HelloHelloStringResult) ReadField0(iprot thrift.TProtocol) error {
	if v, err := iprot.ReadString(); err != nil {
		return thrift.PrependError("error reading field 0: ", err)
	} else {
		p.Success = &v
	}
	return nil
}

func (p *HelloHelloStringResult) Write(oprot thrift.TProtocol) error {
	if err := oprot.WriteStructBegin("helloString_result"); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
	}
	if p != nil {
		if err := p.writeField0(oprot); err != nil {
			return err
		}
	}
	if err := oprot.WriteFieldStop(); err != nil {
		return thrift.PrependError("write field stop error: ", err)
	}
	if err := oprot.WriteStructEnd(); err != nil {
		return thrift.PrependError("write struct stop error: ", err)
	}
	return nil
}

func (p *HelloHelloStringResult) writeField0(oprot thrift.TProtocol) (err error) {
	if p.IsSetSuccess() {
		if err := oprot.WriteFieldBegin("success", thrift.STRING, 0); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T write field begin error 0:success: ", p), err)
		}
		if err := oprot.WriteString(string(*p.Success)); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T.success (0) field write error: ", p), err)
		}
		if err := oprot.WriteFieldEnd(); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T write field end error 0:success: ", p), err)
		}
	}
	return err
}

func (p *HelloHelloStringResult) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("HelloHelloStringResult(%+v)", *p)
}

// Attributes:
//  - Para
type HelloHelloIntArgs struct {
	Para int32 `thrift:"para,1" db:"para" json:"para"`
}

func NewHelloHelloIntArgs() *HelloHelloIntArgs {
	return &HelloHelloIntArgs{}
}

func (p *HelloHelloIntArgs) GetPara() int32 {
	return p.Para
}
func (p *HelloHelloIntArgs) Read(iprot thrift.TProtocol) error {
	if _, err := iprot.ReadStructBegin(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read error: ", p), err)
	}

	for {
		_, fieldTypeId, fieldId, err := iprot.ReadFieldBegin()
		if err != nil {
			return thrift.PrependError(fmt.Sprintf("%T field %d read error: ", p, fieldId), err)
		}
		if fieldTypeId == thrift.STOP {
			break
		}
		switch fieldId {
		case 1:
			if fieldTypeId == thrift.I32 {
				if err := p.ReadField1(iprot); err != nil {
					return err
				}
			} else {
				if err := iprot.Skip(fieldTypeId); err != nil {
					return err
				}
			}
		default:
			if err := iprot.Skip(fieldTypeId); err != nil {
				return err
			}
		}
		if err := iprot.ReadFieldEnd(); err != nil {
			return err
		}
	}
	if err := iprot.ReadStructEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
	}
	return nil
}

func (p *HelloHelloIntArgs) ReadField1(iprot thrift.TProtocol) error {
	if v, err := iprot.ReadI32(); err != nil {
		return thrift.PrependError("error reading field 1: ", err)
	} else {
		p.Para = v
	}
	return nil
}

func (p *HelloHelloIntArgs) Write(oprot thrift.TProtocol) error {
	if err := oprot.WriteStructBegin("helloInt_args"); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
	}
	if p != nil {
		if err := p.writeField1(oprot); err != nil {
			return err
		}
	}
	if err := oprot.WriteFieldStop(); err != nil {
		return thrift.PrependError("write field stop error: ", err)
	}
	if err := oprot.WriteStructEnd(); err != nil {
		return thrift.PrependError("write struct stop error: ", err)
	}
	return nil
}

func (p *HelloHelloIntArgs) writeField1(oprot thrift.TProtocol) (err error) {
	if err := oprot.WriteFieldBegin("para", thrift.I32, 1); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write field begin error 1:para: ", p), err)
	}
	if err := oprot.WriteI32(int32(p.Para)); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T.para (1) field write error: ", p), err)
	}
	if err := oprot.WriteFieldEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write field end error 1:para: ", p), err)
	}
	return err
}

func (p *HelloHelloIntArgs) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("HelloHelloIntArgs(%+v)", *p)
}

// Attributes:
//  - Success
type HelloHelloIntResult struct {
	Success *int32 `thrift:"success,0" db:"success" json:"success,omitempty"`
}

func NewHelloHelloIntResult() *HelloHelloIntResult {
	return &HelloHelloIntResult{}
}

var HelloHelloIntResult_Success_DEFAULT int32

func (p *HelloHelloIntResult) GetSuccess() int32 {
	if !p.IsSetSuccess() {
		return HelloHelloIntResult_Success_DEFAULT
	}
	return *p.Success
}
func (p *HelloHelloIntResult) IsSetSuccess() bool {
	return p.Success != nil
}

func (p *HelloHelloIntResult) Read(iprot thrift.TProtocol) error {
	if _, err := iprot.ReadStructBegin(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read error: ", p), err)
	}

	for {
		_, fieldTypeId, fieldId, err := iprot.ReadFieldBegin()
		if err != nil {
			return thrift.PrependError(fmt.Sprintf("%T field %d read error: ", p, fieldId), err)
		}
		if fieldTypeId == thrift.STOP {
			break
		}
		switch fieldId {
		case 0:
			if fieldTypeId == thrift.I32 {
				if err := p.ReadField0(iprot); err != nil {
					return err
				}
			} else {
				if err := iprot.Skip(fieldTypeId); err != nil {
					return err
				}
			}
		default:
			if err := iprot.Skip(fieldTypeId); err != nil {
				return err
			}
		}
		if err := iprot.ReadFieldEnd(); err != nil {
			return err
		}
	}
	if err := iprot.ReadStructEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
	}
	return nil
}

func (p *HelloHelloIntResult) ReadField0(iprot thrift.TProtocol) error {
	if v, err := iprot.ReadI32(); err != nil {
		return thrift.PrependError("error reading field 0: ", err)
	} else {
		p.Success = &v
	}
	return nil
}

func (p *HelloHelloIntResult) Write(oprot thrift.TProtocol) error {
	if err := oprot.WriteStructBegin("helloInt_result"); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
	}
	if p != nil {
		if err := p.writeField0(oprot); err != nil {
			return err
		}
	}
	if err := oprot.WriteFieldStop(); err != nil {
		return thrift.PrependError("write field stop error: ", err)
	}
	if err := oprot.WriteStructEnd(); err != nil {
		return thrift.PrependError("write struct stop error: ", err)
	}
	return nil
}

func (p *HelloHelloIntResult) writeField0(oprot thrift.TProtocol) (err error) {
	if p.IsSetSuccess() {
		if err := oprot.WriteFieldBegin("success", thrift.I32, 0); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T write field begin error 0:success: ", p), err)
		}
		if err := oprot.WriteI32(int32(*p.Success)); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T.success (0) field write error: ", p), err)
		}
		if err := oprot.WriteFieldEnd(); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T write field end error 0:success: ", p), err)
		}
	}
	return err
}

func (p *HelloHelloIntResult) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("HelloHelloIntResult(%+v)", *p)
}

// Attributes:
//  - Para
type HelloHelloBooleanArgs struct {
	Para bool `thrift:"para,1" db:"para" json:"para"`
}

func NewHelloHelloBooleanArgs() *HelloHelloBooleanArgs {
	return &HelloHelloBooleanArgs{}
}

func (p *HelloHelloBooleanArgs) GetPara() bool {
	return p.Para
}
func (p *HelloHelloBooleanArgs) Read(iprot thrift.TProtocol) error {
	if _, err := iprot.ReadStructBegin(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read error: ", p), err)
	}

	for {
		_, fieldTypeId, fieldId, err := iprot.ReadFieldBegin()
		if err != nil {
			return thrift.PrependError(fmt.Sprintf("%T field %d read error: ", p, fieldId), err)
		}
		if fieldTypeId == thrift.STOP {
			break
		}
		switch fieldId {
		case 1:
			if fieldTypeId == thrift.BOOL {
				if err := p.ReadField1(iprot); err != nil {
					return err
				}
			} else {
				if err := iprot.Skip(fieldTypeId); err != nil {
					return err
				}
			}
		default:
			if err := iprot.Skip(fieldTypeId); err != nil {
				return err
			}
		}
		if err := iprot.ReadFieldEnd(); err != nil {
			return err
		}
	}
	if err := iprot.ReadStructEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
	}
	return nil
}

func (p *HelloHelloBooleanArgs) ReadField1(iprot thrift.TProtocol) error {
	if v, err := iprot.ReadBool(); err != nil {
		return thrift.PrependError("error reading field 1: ", err)
	} else {
		p.Para = v
	}
	return nil
}

func (p *HelloHelloBooleanArgs) Write(oprot thrift.TProtocol) error {
	if err := oprot.WriteStructBegin("helloBoolean_args"); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
	}
	if p != nil {
		if err := p.writeField1(oprot); err != nil {
			return err
		}
	}
	if err := oprot.WriteFieldStop(); err != nil {
		return thrift.PrependError("write field stop error: ", err)
	}
	if err := oprot.WriteStructEnd(); err != nil {
		return thrift.PrependError("write struct stop error: ", err)
	}
	return nil
}

func (p *HelloHelloBooleanArgs) writeField1(oprot thrift.TProtocol) (err error) {
	if err := oprot.WriteFieldBegin("para", thrift.BOOL, 1); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write field begin error 1:para: ", p), err)
	}
	if err := oprot.WriteBool(bool(p.Para)); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T.para (1) field write error: ", p), err)
	}
	if err := oprot.WriteFieldEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write field end error 1:para: ", p), err)
	}
	return err
}

func (p *HelloHelloBooleanArgs) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("HelloHelloBooleanArgs(%+v)", *p)
}

// Attributes:
//  - Success
type HelloHelloBooleanResult struct {
	Success *bool `thrift:"success,0" db:"success" json:"success,omitempty"`
}

func NewHelloHelloBooleanResult() *HelloHelloBooleanResult {
	return &HelloHelloBooleanResult{}
}

var HelloHelloBooleanResult_Success_DEFAULT bool

func (p *HelloHelloBooleanResult) GetSuccess() bool {
	if !p.IsSetSuccess() {
		return HelloHelloBooleanResult_Success_DEFAULT
	}
	return *p.Success
}
func (p *HelloHelloBooleanResult) IsSetSuccess() bool {
	return p.Success != nil
}

func (p *HelloHelloBooleanResult) Read(iprot thrift.TProtocol) error {
	if _, err := iprot.ReadStructBegin(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read error: ", p), err)
	}

	for {
		_, fieldTypeId, fieldId, err := iprot.ReadFieldBegin()
		if err != nil {
			return thrift.PrependError(fmt.Sprintf("%T field %d read error: ", p, fieldId), err)
		}
		if fieldTypeId == thrift.STOP {
			break
		}
		switch fieldId {
		case 0:
			if fieldTypeId == thrift.BOOL {
				if err := p.ReadField0(iprot); err != nil {
					return err
				}
			} else {
				if err := iprot.Skip(fieldTypeId); err != nil {
					return err
				}
			}
		default:
			if err := iprot.Skip(fieldTypeId); err != nil {
				return err
			}
		}
		if err := iprot.ReadFieldEnd(); err != nil {
			return err
		}
	}
	if err := iprot.ReadStructEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
	}
	return nil
}

func (p *HelloHelloBooleanResult) ReadField0(iprot thrift.TProtocol) error {
	if v, err := iprot.ReadBool(); err != nil {
		return thrift.PrependError("error reading field 0: ", err)
	} else {
		p.Success = &v
	}
	return nil
}

func (p *HelloHelloBooleanResult) Write(oprot thrift.TProtocol) error {
	if err := oprot.WriteStructBegin("helloBoolean_result"); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
	}
	if p != nil {
		if err := p.writeField0(oprot); err != nil {
			return err
		}
	}
	if err := oprot.WriteFieldStop(); err != nil {
		return thrift.PrependError("write field stop error: ", err)
	}
	if err := oprot.WriteStructEnd(); err != nil {
		return thrift.PrependError("write struct stop error: ", err)
	}
	return nil
}

func (p *HelloHelloBooleanResult) writeField0(oprot thrift.TProtocol) (err error) {
	if p.IsSetSuccess() {
		if err := oprot.WriteFieldBegin("success", thrift.BOOL, 0); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T write field begin error 0:success: ", p), err)
		}
		if err := oprot.WriteBool(bool(*p.Success)); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T.success (0) field write error: ", p), err)
		}
		if err := oprot.WriteFieldEnd(); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T write field end error 0:success: ", p), err)
		}
	}
	return err
}

func (p *HelloHelloBooleanResult) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("HelloHelloBooleanResult(%+v)", *p)
}

type HelloHelloVoidArgs struct {
}

func NewHelloHelloVoidArgs() *HelloHelloVoidArgs {
	return &HelloHelloVoidArgs{}
}

func (p *HelloHelloVoidArgs) Read(iprot thrift.TProtocol) error {
	if _, err := iprot.ReadStructBegin(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read error: ", p), err)
	}

	for {
		_, fieldTypeId, fieldId, err := iprot.ReadFieldBegin()
		if err != nil {
			return thrift.PrependError(fmt.Sprintf("%T field %d read error: ", p, fieldId), err)
		}
		if fieldTypeId == thrift.STOP {
			break
		}
		if err := iprot.Skip(fieldTypeId); err != nil {
			return err
		}
		if err := iprot.ReadFieldEnd(); err != nil {
			return err
		}
	}
	if err := iprot.ReadStructEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
	}
	return nil
}

func (p *HelloHelloVoidArgs) Write(oprot thrift.TProtocol) error {
	if err := oprot.WriteStructBegin("helloVoid_args"); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
	}
	if p != nil {
	}
	if err := oprot.WriteFieldStop(); err != nil {
		return thrift.PrependError("write field stop error: ", err)
	}
	if err := oprot.WriteStructEnd(); err != nil {
		return thrift.PrependError("write struct stop error: ", err)
	}
	return nil
}

func (p *HelloHelloVoidArgs) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("HelloHelloVoidArgs(%+v)", *p)
}

type HelloHelloVoidResult struct {
}

func NewHelloHelloVoidResult() *HelloHelloVoidResult {
	return &HelloHelloVoidResult{}
}

func (p *HelloHelloVoidResult) Read(iprot thrift.TProtocol) error {
	if _, err := iprot.ReadStructBegin(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read error: ", p), err)
	}

	for {
		_, fieldTypeId, fieldId, err := iprot.ReadFieldBegin()
		if err != nil {
			return thrift.PrependError(fmt.Sprintf("%T field %d read error: ", p, fieldId), err)
		}
		if fieldTypeId == thrift.STOP {
			break
		}
		if err := iprot.Skip(fieldTypeId); err != nil {
			return err
		}
		if err := iprot.ReadFieldEnd(); err != nil {
			return err
		}
	}
	if err := iprot.ReadStructEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
	}
	return nil
}

func (p *HelloHelloVoidResult) Write(oprot thrift.TProtocol) error {
	if err := oprot.WriteStructBegin("helloVoid_result"); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
	}
	if p != nil {
	}
	if err := oprot.WriteFieldStop(); err != nil {
		return thrift.PrependError("write field stop error: ", err)
	}
	if err := oprot.WriteStructEnd(); err != nil {
		return thrift.PrependError("write struct stop error: ", err)
	}
	return nil
}

func (p *HelloHelloVoidResult) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("HelloHelloVoidResult(%+v)", *p)
}

type HelloHelloNullArgs struct {
}

func NewHelloHelloNullArgs() *HelloHelloNullArgs {
	return &HelloHelloNullArgs{}
}

func (p *HelloHelloNullArgs) Read(iprot thrift.TProtocol) error {
	if _, err := iprot.ReadStructBegin(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read error: ", p), err)
	}

	for {
		_, fieldTypeId, fieldId, err := iprot.ReadFieldBegin()
		if err != nil {
			return thrift.PrependError(fmt.Sprintf("%T field %d read error: ", p, fieldId), err)
		}
		if fieldTypeId == thrift.STOP {
			break
		}
		if err := iprot.Skip(fieldTypeId); err != nil {
			return err
		}
		if err := iprot.ReadFieldEnd(); err != nil {
			return err
		}
	}
	if err := iprot.ReadStructEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
	}
	return nil
}

func (p *HelloHelloNullArgs) Write(oprot thrift.TProtocol) error {
	if err := oprot.WriteStructBegin("helloNull_args"); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
	}
	if p != nil {
	}
	if err := oprot.WriteFieldStop(); err != nil {
		return thrift.PrependError("write field stop error: ", err)
	}
	if err := oprot.WriteStructEnd(); err != nil {
		return thrift.PrependError("write struct stop error: ", err)
	}
	return nil
}

func (p *HelloHelloNullArgs) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("HelloHelloNullArgs(%+v)", *p)
}

// Attributes:
//  - Success
type HelloHelloNullResult struct {
	Success *string `thrift:"success,0" db:"success" json:"success,omitempty"`
}

func NewHelloHelloNullResult() *HelloHelloNullResult {
	return &HelloHelloNullResult{}
}

var HelloHelloNullResult_Success_DEFAULT string

func (p *HelloHelloNullResult) GetSuccess() string {
	if !p.IsSetSuccess() {
		return HelloHelloNullResult_Success_DEFAULT
	}
	return *p.Success
}
func (p *HelloHelloNullResult) IsSetSuccess() bool {
	return p.Success != nil
}

func (p *HelloHelloNullResult) Read(iprot thrift.TProtocol) error {
	if _, err := iprot.ReadStructBegin(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read error: ", p), err)
	}

	for {
		_, fieldTypeId, fieldId, err := iprot.ReadFieldBegin()
		if err != nil {
			return thrift.PrependError(fmt.Sprintf("%T field %d read error: ", p, fieldId), err)
		}
		if fieldTypeId == thrift.STOP {
			break
		}
		switch fieldId {
		case 0:
			if fieldTypeId == thrift.STRING {
				if err := p.ReadField0(iprot); err != nil {
					return err
				}
			} else {
				if err := iprot.Skip(fieldTypeId); err != nil {
					return err
				}
			}
		default:
			if err := iprot.Skip(fieldTypeId); err != nil {
				return err
			}
		}
		if err := iprot.ReadFieldEnd(); err != nil {
			return err
		}
	}
	if err := iprot.ReadStructEnd(); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
	}
	return nil
}

func (p *HelloHelloNullResult) ReadField0(iprot thrift.TProtocol) error {
	if v, err := iprot.ReadString(); err != nil {
		return thrift.PrependError("error reading field 0: ", err)
	} else {
		p.Success = &v
	}
	return nil
}

func (p *HelloHelloNullResult) Write(oprot thrift.TProtocol) error {
	if err := oprot.WriteStructBegin("helloNull_result"); err != nil {
		return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
	}
	if p != nil {
		if err := p.writeField0(oprot); err != nil {
			return err
		}
	}
	if err := oprot.WriteFieldStop(); err != nil {
		return thrift.PrependError("write field stop error: ", err)
	}
	if err := oprot.WriteStructEnd(); err != nil {
		return thrift.PrependError("write struct stop error: ", err)
	}
	return nil
}

func (p *HelloHelloNullResult) writeField0(oprot thrift.TProtocol) (err error) {
	if p.IsSetSuccess() {
		if err := oprot.WriteFieldBegin("success", thrift.STRING, 0); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T write field begin error 0:success: ", p), err)
		}
		if err := oprot.WriteString(string(*p.Success)); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T.success (0) field write error: ", p), err)
		}
		if err := oprot.WriteFieldEnd(); err != nil {
			return thrift.PrependError(fmt.Sprintf("%T write field end error 0:success: ", p), err)
		}
	}
	return err
}

func (p *HelloHelloNullResult) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("HelloHelloNullResult(%+v)", *p)
}
