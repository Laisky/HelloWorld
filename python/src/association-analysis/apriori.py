#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Modified from: http://goo.gl/7u27tb
import sys
import logging
import functools

import numpy as np
import pandas as pd


N_CANDIDATES_LIMITE = 200
N_RULES_LIMIT = 10000


log = logging.getLogger(__name__)


def apriori(dataset, min_support=0.5, min_hconf=0.5):
    """Implements the Apriori algorithm.

    The Apriori algorithm will iteratively generate new candidate
    k-itemsets using the frequent (k-1)-itemsets found in the previous
    iteration.

    Parameters
    ----------
    dataset : list
        The dataset (a list of transactions) from which to generate
        candidate itemsets.

    min_support : float
        The minimum support threshold. Defaults to 0.5.

    min_hconf: float
        The minimum support h-threshold. Defaults to 0.5.

    Returns
    -------
    F : list
        The list of frequent itemsets.

    support_map : dict
        The support data for all candidate itemsets.

    References
    ----------
    .. [1] R. Agrawal, R. Srikant, "Fast Algorithms for Mining Association
           Rules", 1994.
    """
    C1 = create_candidates(dataset)
    D = list(map(set, dataset))
    support_map, single_item_supp_map = create_support_map(D, C1)
    load_supp = functools.partial(_load_supp, len(dataset), support_map,
                                  single_item_supp_map)
    F1 = support_prune(C1, min_support, min_hconf, load_supp)
    F = [F1]
    k = 2
    while (len(F[k - 2]) > 0):
        Ck = apriori_gen(F[k - 2], k, load_supp, min_hconf)
        Fk = support_prune(Ck, min_support, min_hconf, load_supp, k)
        F.append(Fk)
        k += 1

    return F, load_supp


def create_support_map(dataset, C1):
    """ Convert dataset to bitmap support-map

    Parameters
    ----------
    dataset: list

    C1: list
    """
    len_dataset = len(dataset)
    support_map = {
        list(item)[0]: np.zeros(len_dataset, dtype=np.bool)
        for item in C1
    }

    for i, trac in enumerate(dataset):
        for item in trac:
            support_map[item][i] = 1

    single_item_supp_map = {
        item: support_map[item].sum() / len_dataset
        for item in support_map
    }

    return support_map, single_item_supp_map


def _load_supp(len_dataset, support_map, single_item_supp_map, itemset):
    if not isinstance(itemset, frozenset):
        return single_item_supp_map[itemset]

    if len(itemset) == 1:
        return single_item_supp_map[list(itemset)[0]]

    supp_bits = np.ones(len_dataset, dtype=np.bool)
    for item in itemset:
        np.bitwise_and(supp_bits, support_map[item], supp_bits)

    return supp_bits.sum() / len_dataset


def create_candidates(dataset):
    """Creates a list of candidate 1-itemsets from a list of transactions.

    Parameters
    ----------
    dataset : list
        The dataset (a list of transactions) from which to generate candidate
        itemsets.

    Returns
    -------
    The list of candidate itemsets (c1) passed as a frozenset (a set that is
    immutable and hashable).
    """
    log.info('create_candidates')

    c1 = set([])
    for transaction in dataset:
        c1.update(transaction)

    return [frozenset([_]) for _ in c1]


def support_prune(candidates, min_support, min_hconf, load_supp, k=None):
    """Returns all candidate itemsets that meet a minimum support threshold.

    By the apriori principle, if an itemset is frequent, then all of its
    subsets must also be frequent. As a result, we can perform support-based
    pruning to systematically control the exponential growth of candidate
    itemsets. Thus, itemsets that do not meet the minimum support level are
    pruned from the input list of itemsets (dataset).

    Parameters
    ----------
    dataset : list
        The dataset (a list of transactions) from which to generate candidate
        itemsets.

    candidates : frozenset
        The list of candidate itemsets.

    min_support : float
        The minimum support threshold.

    min_hconf : float
        The minimum h-confidence threshold.

    support_map : dict
        The support data for all candidate itemsets.

    single_item_supp_map : dict
        The support data for each single candidate itemsets.

    k : int

    Returns
    -------
    retlist : list
        The list of frequent itemsets.

    """
    log.info('support_prune with min_supp {}, min_hconf {}'
             .format(min_support, min_hconf))

    n_items = 0
    n_items_limit = N_CANDIDATES_LIMITE

    if k:
        retlist = [0] * n_items_limit
    else:
        retlist = [0] * len(candidates)

    for cand in candidates:
        # Calculate the support of itemset cand.
        support = load_supp(cand)
        if k:
            # Calculate h-confidence
            hconf = support / max(map(load_supp, cand))
        else:
            hconf = 1

        if support >= min_support and hconf >= min_hconf:
            log.debug('{}. save candidates: {}'.format(n_items, cand))
            retlist[n_items] = cand
            n_items += 1
            if k and n_items == n_items_limit:
                break

        if k and n_items == n_items_limit:
            break

    log.debug('save {} itemsets after prune'.format(n_items))
    return retlist[: n_items]


def apriori_gen(freq_sets, k, load_supp, min_hconf):
    """Generates candidate itemsets (via the F_k-1 x F_k-1 method).

    This operation generates new candidate k-itemsets based on the frequent
    (k-1)-itemsets found in the previous iteration. The candidate generation
    procedure merges a pair of frequent (k-1)-itemsets only if their first k-2
    items are identical.

    Parameters
    ----------
    freq_sets : list
        The list of frequent (k-1)-itemsets.

    k : integer
        The cardinality of the current itemsets being evaluated.

    support_map : dict

    min_hconf : float

    single_item_supp_map : dict

    Returns
    -------
    retlist : list
        The list of merged frequent itemsets.
    """
    log.info('apriori_gen for k {}'.format(k))

    freq_sets = [sorted(i) for i in freq_sets]
    n_k_items = 0

    for i, a in enumerate(freq_sets):
        F1 = a[: k - 2]  # first k-2 items of freq_sets[i]
        for b in freq_sets[i + 1:]:
            F2 = b[: k - 2]  # first k-2 items of freq_sets[j]

            # check cross-support property
            if k > 2:
                max_supp = max(map(load_supp, a))
                min_supp = min(map(load_supp, b))
                upper_bound = min_supp / max_supp
                if upper_bound < min_hconf:
                    continue

            if F1 == F2:  # if the first k-2 items are identical
                # Merge the frequent itemsets.
                yield (frozenset(a) | frozenset(b))
                n_k_items += 1

    log.debug('generate {} candidates'.format(n_k_items))


def load_b2b_data():
    return pd.read_pickle('./data/b2b.pkl')


def load_movie_data():
    return pd.read_pickle('./data/ratings.pkl')


def load_merck_data():
    return pd.read_pickle('./data/merck.pkl')


def load_random_data():
    return np.random.exponential(scale=10, size=(1000, 10)).\
        astype(np.int64)


def rules_from_conseq(freq_set, H, load_supp, rules, min_confidence,
                      n_rules):
    """Generates a set of candidate rules.

    Parameters
    ----------
    freq_set : frozenset
        The complete list of frequent itemsets.

    H : list
        A list of frequent itemsets (of a particular length).

    support_data : dict
        The support data for all candidate itemsets.

    rules : list
        A potentially incomplete set of candidate rules above the minimum
        confidence threshold.

    min_confidence : float
        The minimum confidence threshold. Defaults to 0.5.
    """
    m = len(H[0])
    if (len(freq_set) > (m + 1)):
        Hmp1 = apriori_gen(H, m + 1, load_supp, 0)
        Hmp1, n_rules = calc_confidence(freq_set, Hmp1, load_supp, rules,
                                        min_confidence, n_rules)

        if n_rules < N_RULES_LIMIT and len(Hmp1) > 1:
            # If there are candidate rules above the minimum confidence
            # threshold, recurse on the list of these candidate rules.
            n_rules = rules_from_conseq(
                freq_set, Hmp1, load_supp, rules, min_confidence, n_rules
            )
    elif m == 1:
        Hmp1, n_rules = calc_confidence(freq_set, H, load_supp, rules,
                                        min_confidence, n_rules)

    return n_rules


def calc_confidence(freq_set, H, load_supp, rules, min_confidence, n_rules):
    """Evaluates the generated rules.

    One measurement for quantifying the goodness of association rules is
    confidence. The confidence for a rule 'P implies H' (P -> H) is defined as
    the support for P and H divided by the support for P
    (support (P|H) / support(P)), where the | symbol denotes the set union
    (thus P|H means all the items in set P or in set H).

    To calculate the confidence, we iterate through the frequent itemsets and
    associated support data. For each frequent itemset, we divide the support
    of the itemset by the support of the antecedent (left-hand-side of the
    rule).

    Parameters
    ----------
    freq_set : frozenset
        The complete list of frequent itemsets.

    H : list
        A list of frequent itemsets (of a particular length).

    min_support : float
        The minimum support threshold.

    rules : list
        A potentially incomplete set of candidate rules above the minimum
        confidence threshold.

    min_confidence : float
        The minimum confidence threshold. Defaults to 0.5.

    Returns
    -------
    pruned_H : list
        The list of candidate rules above the minimum confidence threshold.
    """
    pruned_H = []
    for conseq in H:
        conf = load_supp(freq_set) / load_supp(freq_set - conseq)
        if conf >= min_confidence:
            rule = (freq_set - conseq, conseq, conf)
            rules.append(rule)
            n_rules += 1
            log.debug('{}. save rule: {}'.format(n_rules, rule))
            pruned_H.append(conseq)

            if n_rules >= N_RULES_LIMIT:
                break

    return pruned_H, n_rules


def generate_rules(F, load_supp, min_confidence=0.5):
    """Generates a set of candidate rules from a list of frequent itemsets.

    For each frequent itemset, we calculate the confidence of using a
    particular item as the rule consequent (right-hand-side of the rule). By
    testing and merging the remaining rules, we recursively create a list of
    pruned rules.

    Parameters
    ----------
    F : list
        A list of frequent itemsets.

    support_data : dict
        The corresponding support data for the frequent itemsets (L).

    min_confidence : float
        The minimum confidence threshold. Defaults to 0.5.

    Returns
    -------
    rules : list
        The list of candidate rules above the minimum confidence threshold.
    """
    rules = []
    n_rules = 0
    for i in range(1, len(F)):
        for freq_set in F[i]:
            H1 = [frozenset([itemset]) for itemset in freq_set]
            if (i > 1):
                n_rules = rules_from_conseq(
                    freq_set, H1, load_supp, rules, min_confidence, n_rules
                )
            else:
                Hmp1, n_rules = calc_confidence(
                    freq_set, H1, load_supp, rules, min_confidence, n_rules
                )

            if n_rules >= N_RULES_LIMIT:
                return rules

    return rules


def setup_log(log):
    log.setLevel(logging.DEBUG)
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.DEBUG)
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    ch.setFormatter(formatter)
    log.addHandler(ch)


def main(min_hconf=0.2, min_conf=0.2):
    logging.basicConfig(filename='apriori_{:1.2f}.log'.format(min_conf),
                        level=logging.DEBUG)
    setup_log(log)
    dataset = load_b2b_data()
    freq_sets_ls, load_supp =\
        apriori(dataset, min_support=0.00009, min_hconf=min_hconf)
    rules = generate_rules(freq_sets_ls, load_supp, min_conf)
    log.info('min_conf: {}'.format(min_conf))
    log.info('length of frequent set: {}'.
             format(sum([len(_) for _ in freq_sets_ls])))
    log.info('length of rules: {}'.
             format(len(rules)))
    # pprint.pprint(r[0])


if __name__ == '__main__':
    # parser = argparse.ArgumentParser()
    # parser.add_argument('-c', '--conf', type=float)
    # args = parser.parse_args()
    # main(args.conf)

    # import profile
    # profile.run('main()', 'prof.txt')
    # import pstats
    # p = pstats.Stats("prof.txt")
    # p.sort_stats("cumtime").print_stats()

    main()
