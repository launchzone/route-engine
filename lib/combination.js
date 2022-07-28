'use strict'

/**
 * `[0]` is current index of item.
 * `[1]` is length of tuple.
 *
 * @typedef {Array<number, number>} TupleCombinationState
 */

/**
 * @typedef {Array<TupleCombinationState>} TupleCombinationIteration
 */

/**
 * @template T
 * @typedef {Array<T>} Tuple
 */

/**
 * @template T
 * @typedef {Array<Tuple<T>>} TupleList
 */

/**
 * @template T
 * @param {TupleList<T>} tupleList
 * @return {TupleList<T>}
 * @example
 * let tuple1 = [1, 2, 3]
 * let tuple2 = [4, 5]
 * let tuple3 = [6]
 * let combinations = makeTupleCombination([tuple1, tuple2, tuple3])
 * // combinations = [
 * //   [1, 4, 6]
 * //   [1, 5, 6]
 * //   [2, 4, 6]
 * //   [2, 5, 6]
 * //   [3, 4, 6]
 * //   [3, 5, 6]
 * // ]
 */
function makeTupleCombination(tupleList) {
    if (hasEmptyTuple(tupleList)) {
        return []
    }
    let iteration = makeTupleCombinationIteration(tupleList)
    let tuples = []
    for (;;) {
        let tuple = nextTupleCombination(tupleList, iteration)
        if (tuple === undefined) {
            return tuples
        }
        tuples.push(tuple)
    }
}

/**
 *
 * @param {Array<Array>} tupleList
 * @return {TupleCombinationIteration}
 */
function makeTupleCombinationIteration(tupleList) {
    return tupleList.map(tuple => [0, tuple.length])
}

/**
 *
 * @param {TupleList} tupleList
 * @return {boolean}
 */
function hasEmptyTuple(tupleList) {
    for (let tuple of tupleList) {
        if (tuple.length === 0) {
            return true
        }
    }
    return false
}

/**
 * @template T
 * @param {TupleList<T>} tupleList
 * @param {TupleCombinationIteration} iteration
 * @return {Tuple<T>}
 */
function nextTupleCombination(tupleList, iteration) {
    if (!hasNextTupleCombination(iteration)) {
        return undefined
    }
    let tuple = iteration.map(([tupleIndex], listIndex) => {
        return tupleList[listIndex][tupleIndex]
    })
    nextIterationTupleCombination(iteration)
    return tuple
}

/**
 *
 * @param {TupleCombinationIteration} iteration
 * @return {boolean}
 */
function hasNextTupleCombination(iteration) {
    if (iteration.length === 0) {
        return false
    }
    let [firstIndex, firstLength] = iteration[0]
    return (firstIndex < firstLength)
}

/**
 *
 * @param {TupleCombinationIteration} iteration
 */
function nextIterationTupleCombination(iteration) {
    for (let i = iteration.length - 1; i >= 0; --i) {
        let [index, length] = iteration[i]
        index = index + 1
        iteration[i][0] = index
        if (index < length) {
            break
        }
        else if (index === length && i > 0) {
            resetIteratorRight(iteration, i)
        }
    }
}

/**
 *
 * @param {TupleCombinationIteration} iteration
 * @param {number} from
 */
function resetIteratorRight(iteration, from) {
    for (let i = from; i < iteration.length; ++i) {
        iteration[i][0] = 0
    }
}

module.exports = {
    makeTupleCombination
}
