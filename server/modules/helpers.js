import _ from 'lodash';
import { AUTO_AM } from '../constants';

export const isSourceAutoAm = function(source) {
    return source === AUTO_AM.NAME;
};

export const isArraysEqual = function(x, y) {
    return _(x).differenceWith(y, _.isEqual).isEmpty();
};
