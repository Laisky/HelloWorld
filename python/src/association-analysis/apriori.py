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
        if len(Ck) == 0:
            log.debug('generate no candidates')
            break

        Fk = support_prune(D, Ck, min_support, min_hconf,
                           support_map, single_item_supp_map)
        F.append(Fk)
        k += 1

    return F, support_map


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
                  support_map, single_item_supp_map):
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

    Returns
    -------
    retlist : list
        The list of frequent itemsets.

    """
    log.info('support_prune with min_supp {}, min_hconf {}'
             .format(min_support, min_hconf))

    len_dataset = len(dataset)
    len_each_cand = len(candidates[0])
    n_items = 0

    retlist = [0] * len(candidates)
    for cand in candidates:
        supp_bits = np.ones(len_dataset, dtype=np.bool)
        supp_cand = []
        for item in cand:
            np.bitwise_and(supp_bits, support_map[item], supp_bits)
            supp_cand.append(single_item_supp_map[item])

        n_supp = supp_bits.sum()

        # Calculate the support of itemset cand.
        support = n_supp / len_dataset

        if len_each_cand > 1:
            # Calculate h-confidence
            hconf = support / max(supp_cand)
        else:
            hconf = 1

        if support >= min_support and hconf >= min_hconf:
            log.debug('save candidates: {}'.format(cand))
            retlist[n_items] = cand
            n_items += 1

    log.debug('save {} itemsets after prune'.format(len(retlist)))
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
    n_k_items_limit = 1000000
    n_k_items = 1
    retlist = [0] * n_k_items_limit

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
                    log.debug('prune by cross-support property')
                    continue

            if F1 == F2:  # if the first k-2 items are identical
                # Merge the frequent itemsets.
                retlist[n_k_items - 1] = frozenset(a) | frozenset(b)
                n_k_items += 1
                if n_k_items > n_k_items_limit:
                    break

        if n_k_items > n_k_items_limit:
            break

    log.debug('generate {} candidates'.format(n_k_items))
    return retlist[: n_k_items - 1]


def load_b2b_data():
    return pd.read_pickle(
        '/Users/laisky/repo/caigen-lab/consume-analysis/data/b2b.pkl'
    )


def load_movie_data():
    return pd.read_pickle(
        '/Users/laisky/repo/caigen-lab/consume-analysis/data/ratings.pkl'
    )


def load_merck_data():
    return pd.read_pickle(
        '/Users/laisky/repo/caigen-lab/consume-analysis/data/merck.pkl'
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


def main(min_conf=0.1):
    logging.basicConfig(filename='apriori_{:1.2f}.log'.format(min_conf),
                        level=logging.DEBUG)
    setup_log(log)
    # dataset = np.random.exponential(scale=10, size=(1000, 10)).\
    #     astype(np.int64)
    dataset = load_merck_data()
    r = apriori(dataset, min_support=0.00009, min_hconf=min_conf)
    log.info('min_conf: {}'.format(min_conf))
    log.info(sum([len(_) for _ in r[0]]))
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
