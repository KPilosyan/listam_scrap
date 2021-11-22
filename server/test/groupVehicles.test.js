/* eslint-disable no-undef */

import _ from 'lodash';
import MockScrapedVehicles from '../mock/MockScrapedVehicles';
import VehicleGroupService from '../services/VehicleGroupService';
import './customMethods';

describe('VehicleGroupService Test', () => {
    test('1. Gruop vehicle AUDI Q7 2019', () => {
        const vehicles = MockScrapedVehicles.get('AUDI', 'Q7', 2019);
        const grouped = new VehicleGroupService().group(vehicles);

        // all of the grouped vehicles should have an object with keys -
        // mark, model, avgPrice, isDeviatedAvgPrice released, count, deviationCount

        const keys = [
            'mark',
            'model',
            'avgPrice',
            'isDeviatedAvgPrice',
            'released',
            'count',
            'deviationCount'
        ];

        const actual = grouped[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();

        const expected = {
            count: 4,
            deviationCount: 3,
            avgPrice: 14065000,
            isDeviatedAvgPrice: true,
            mark: 'AUDI',
            model: 'Q7',
            released: 2019,
        };

        expect(actual).toEqual(expected);
    });

    test('2. Gruop vehicle AUDI Q7 2009', () => {
        const vehicles = MockScrapedVehicles.get('AUDI', 'Q7', 2009);
        const grouped = new VehicleGroupService().group(vehicles);

        // all of the grouped vehicles should have an object with keys -
        // mark, model, avgPrice, isDeviatedAvgPrice released, count, deviationCount

        const keys = [
            'mark',
            'model',
            'avgPrice',
            'isDeviatedAvgPrice',
            'released',
            'count',
            'deviationCount'
        ];

        const actual = grouped[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();

        const expected = {
            count: 2,
            deviationCount: 0,
            avgPrice: 6717250,
            isDeviatedAvgPrice: true,
            mark: 'AUDI',
            model: 'Q7',
            released: 2009,
        };

        expect(actual).toEqual(expected);
    });

    test('3. Gruop vehicle AUDI A8 2011', () => {
        const vehicles = MockScrapedVehicles.get('AUDI', 'A8', 2011);
        const grouped = new VehicleGroupService().group(vehicles);

        // all of the grouped vehicles should have an object with keys -
        // mark, model, avgPrice, isDeviatedAvgPrice released, count, deviationCount

        const keys = [
            'mark',
            'model',
            'avgPrice',
            'isDeviatedAvgPrice',
            'released',
            'count',
            'deviationCount'
        ];

        const actual = grouped[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();

        const expected = {
            count: 1,
            deviationCount: 0,
            avgPrice: 8730000,
            isDeviatedAvgPrice: true,
            mark: 'AUDI',
            model: 'A8',
            released: 2011,
        };

        expect(actual).toEqual(expected);
    });

    test('4. Gruop vehicle AUDI A6 2009', () => {
        const vehicles = MockScrapedVehicles.get('AUDI', 'A6', 2009);
        const grouped = new VehicleGroupService().group(vehicles);

        // all of the grouped vehicles should have an object with keys -
        // mark, model, avgPrice, isDeviatedAvgPrice released, count, deviationCount

        const keys = [
            'mark',
            'model',
            'avgPrice',
            'isDeviatedAvgPrice',
            'released',
            'count',
            'deviationCount'
        ];

        const actual = grouped[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();

        const expected = {
            count: 4,
            deviationCount: 0,
            avgPrice: 4753000,
            isDeviatedAvgPrice: true,
            mark: 'AUDI',
            model: 'A6',
            released: 2009,
        };

        expect(actual).toEqual(expected);
    });

    test('5. Gruop vehicle AUDI A6 2005', () => {
        const vehicles = MockScrapedVehicles.get('AUDI', 'A6', 2005);
        const grouped = new VehicleGroupService().group(vehicles);

        // all of the grouped vehicles should have an object with keys -
        // mark, model, avgPrice, isDeviatedAvgPrice released, count, deviationCount

        const keys = [
            'mark',
            'model',
            'avgPrice',
            'isDeviatedAvgPrice',
            'released',
            'count',
            'deviationCount'
        ];

        const actual = grouped[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();

        const expected = {
            count: 4,
            deviationCount: 0,
            avgPrice: 3661750,
            isDeviatedAvgPrice: true,
            mark: 'AUDI',
            model: 'A6',
            released: 2005,
        };

        expect(actual).toEqual(expected);
    });

    test('6. Gruop vehicle AUDI A4 2007', () => {
        const vehicles = MockScrapedVehicles.get('AUDI', 'A4', 2007);
        const grouped = new VehicleGroupService().group(vehicles);

        // all of the grouped vehicles should have an object with keys -
        // mark, model, avgPrice, isDeviatedAvgPrice released, count, deviationCount

        const keys = [
            'mark',
            'model',
            'avgPrice',
            'isDeviatedAvgPrice',
            'released',
            'count',
            'deviationCount'
        ];

        const actual = grouped[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();

        const expected = {
            count: 21,
            deviationCount: 4,
            avgPrice: 2684332,
            isDeviatedAvgPrice: false,
            mark: 'AUDI',
            model: 'A4',
            released: 2007,
        };

        expect(actual).toEqual(expected);
    });

    test('7. Gruop vehicle NIVA 2121 2018', () => {
        const vehicles = MockScrapedVehicles.get('NIVA', '2121', 2018);
        const grouped = new VehicleGroupService().group(vehicles);

        // all of the grouped vehicles should have an object with keys -
        // mark, model, avgPrice, isDeviatedAvgPrice released, count, deviationCount

        const keys = [
            'mark',
            'model',
            'avgPrice',
            'isDeviatedAvgPrice',
            'released',
            'count',
            'deviationCount'
        ];

        const actual = grouped[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();

        const expected = {
            count: 5,
            deviationCount: 1,
            avgPrice: 4231625,
            isDeviatedAvgPrice: true,
            mark: 'NIVA',
            model: '2121',
            released: 2018,
        };

        expect(actual).toEqual(expected);
    });

    test('8. Gruop vehicle NIVA 2121 2017', () => {
        const vehicles = MockScrapedVehicles.get('NIVA', '2121', 2017);
        const grouped = new VehicleGroupService().group(vehicles);

        // all of the grouped vehicles should have an object with keys -
        // mark, model, avgPrice, isDeviatedAvgPrice released, count, deviationCount

        const keys = [
            'mark',
            'model',
            'avgPrice',
            'isDeviatedAvgPrice',
            'released',
            'count',
            'deviationCount'
        ];

        const actual = grouped[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();

        const expected = {
            count: 5,
            deviationCount: 5,
            avgPrice: null,
            isDeviatedAvgPrice: true,
            mark: 'NIVA',
            model: '2121',
            released: 2017,
        };

        expect(actual).toEqual(expected);
    });

    test('9. Gruop vehicle VAZ(LADA) PRIORA 2006', () => {
        const vehicles = MockScrapedVehicles.get('VAZ(LADA)', 'PRIORA', 2006);
        const grouped = new VehicleGroupService().group(vehicles);

        // all of the grouped vehicles should have an object with keys -
        // mark, model, avgPrice, isDeviatedAvgPrice released, count, deviationCount

        const keys = [
            'mark',
            'model',
            'avgPrice',
            'isDeviatedAvgPrice',
            'released',
            'count',
            'deviationCount'
        ];

        const actual = grouped[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();

        const expected = {
            count: 4,
            deviationCount: 0,
            avgPrice: 1176125,
            isDeviatedAvgPrice: true,
            mark: 'VAZ(LADA)',
            model: 'PRIORA',
            released: 2006,
        };

        expect(actual).toEqual(expected);
    });
});
