#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Modified from: http://goo.gl/7u27tb
import sys
import logging

import numpy as np
import pandas as pd


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
    F1 = support_prune(D, C1, min_support, min_hconf,
                       support_map, single_item_supp_map)
    F = [F1]
    k = 2
    while (len(F[k - 2]) > 0):
        Ck = apriori_gen(F[k - 2], k, support_map, min_hconf,
                         single_item_supp_map)
        Fk = support_prune(D, Ck, min_support, min_hconf,
                           support_map, single_item_supp_map, k)
        F.append(Fk)
        k += 1

    return F, support_map, single_item_supp_map


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


def load_supp(len_dataset, itemset, support_map):
    supp_bits = np.ones(len_dataset, dtype=np.bool)
    for item in itemset:
        np.bitwise_and(supp_bits, support_map[item], supp_bits)

    return supp_bits.sum()


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


def support_prune(dataset, candidates, min_support, min_hconf,
                  support_map, single_item_supp_map, k=None):
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

    len_dataset = len(dataset)
    n_items = 0
    n_items_limit = 1000

    retlist = [0] * n_items_limit
    for cand in candidates:
        supp_bits = np.ones(len_dataset, dtype=np.bool)
        supp_cand = []
        for item in cand:
            np.bitwise_and(supp_bits, support_map[item], supp_bits)
            supp_cand.append(single_item_supp_map[item])

        n_supp = supp_bits.sum()
        # Calculate the support of itemset cand.
        support = n_supp / len_dataset
        if k:
            # Calculate h-confidence
            hconf = support / max(supp_cand)
        else:
            hconf = 1

        if support >= min_support and hconf >= min_hconf:
            log.debug('{}. save candidates: {}'.format(n_items, cand))
            retlist[n_items] = cand
            n_items += 1
            if n_items == n_items_limit:
                break

        if n_items == n_items_limit:
            break

    log.debug('save {} itemsets after prune'.format(n_items))
    return retlist[: n_items]


def apriori_gen(freq_sets, k, support_map, min_hconf, single_item_supp_map):
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
                max_supp = max([single_item_supp_map[item] for item in a])
                min_supp = min([single_item_supp_map[item] for item in b])
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


def mine_assoc_rules(freq_sets_ls, support_map, single_item_supp_map,
                     min_conf=0.2):
    rules = []
    len_dataset = len(next(iter(support_map.values())))
    for freq_sets in freq_sets_ls:
        for freq_set in freq_sets:
            for right in freq_set:
                right = frozenset([right])
                left = freq_set - right

                generate_rules(
                    left, right, rules, freq_set, support_map,
                    single_item_supp_map,
                    min_conf, len_dataset, n_rules_limit=10000, n_rules=0
                )
    return rules


def generate_rules(left, right, rules, freq_set, support_map,
                   single_item_supp_map,
                   min_conf, len_dataset, n_rules_limit, n_rules):
    conf = load_supp(len_dataset, freq_set, support_map) /\
        load_supp(len_dataset, left, support_map)

    if conf >= min_conf:
        rule = (left, right, conf)
        rules.append(rule)
        log.debug('append rule: {}'.format(rule))
        n_rules += 1
        if n_rules == n_rules_limit:
            return

        for item in left:
            new_left = left.difference([item])
            new_right = right.union([item])
            generate_rules(
                new_left, new_right, rules, freq_set, support_map,
                single_item_supp_map,
                min_conf, len_dataset, n_rules_limit, n_rules=n_rules
            )


def setup_log(log):
    log.setLevel(logging.DEBUG)
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.DEBUG)
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    ch.setFormatter(formatter)
    log.addHandler(ch)


def main(min_hconf=0.1, min_conf=0.2):
    logging.basicConfig(filename='apriori_{:1.2f}.log'.format(min_conf),
                        level=logging.DEBUG)
    setup_log(log)
    # dataset = np.random.exponential(scale=10, size=(1000, 10)).\
    #     astype(np.int64)
    dataset = load_merck_data()
    freq_sets_ls, support_map, single_item_supp_map =\
        apriori(dataset, min_support=0.00009, min_hconf=min_hconf)
    rules = mine_assoc_rules(
        freq_sets_ls, support_map, single_item_supp_map, min_conf
    )
    log.info('min_conf: {}'.format(min_conf))
    log.info(sum([len(_) for _ in freq_sets_ls]))
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
