/* eslint-disable no-undef */

import _ from 'lodash';
import MockGroupedVehicles from '../mock/MockGroupedVehicles';
import MockPreviousVehicles from '../mock/MockPreviousVehicles';
import VehicleEstimateService from '../services/VehicleEstimateService';
import './customMethods';

describe('VehicleEstimateService Test', () => {
    test('1. Estimate vehicle AUDI Q7 2009', async () => {
        const grouped = MockGroupedVehicles.get('AUDI', 'Q7', 2009);
        const previous = MockPreviousVehicles.get('AUDI', 'Q7', 2009);
        const estimated = await new VehicleEstimateService()._estimate(grouped, previous);
        // all of the estimated vehicles should have an object with keys -
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

        const actual = estimated[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();
        expect(actual.isDeviatedOldPrice).notOrBoolean();
        expect(actual.oldPrice).notOrNumber();

        const expected = {
            avgPrice: 6717250,
            count: 2,
            deviationCount: 0,
            isDeviatedAvgPrice: true,
            isDeviatedOldPrice: false,
            mark: 'AUDI',
            model: 'Q7',
            oldPrice: 6700000,
            released: 2009,
        };

        expect(actual).toEqual(expected);
    });

    test('2. Estimate vehicle AUDI A4 2007', async () => {
        const grouped = MockGroupedVehicles.get('AUDI', 'A4', 2007);
        const previous = MockPreviousVehicles.get('AUDI', 'A4', 2007);

        const estimated = await new VehicleEstimateService()._estimate(grouped, previous);
        // all of the estimated vehicles should have an object with keys -
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

        const actual = estimated[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();
        expect(actual.isDeviatedOldPrice).notOrBoolean();
        expect(actual.oldPrice).notOrNumber();

        const expected = {
            avgPrice: 2684332,
            acceptedPrice: 2684332,
            oldPrice: 2800000,
            count: 21,
            deviationCount: 4,
            isDeviatedAvgPrice: false,
            isDeviatedOldPrice: false,
            mark: 'AUDI',
            model: 'A4',
            released: 2007,
        };

        expect(actual).toEqual(expected);
    });

    test('3. Estimate vehicle AUDI A8 2011', async () => {
        const grouped = MockGroupedVehicles.get('AUDI', 'A8', 2011);
        const previous = MockPreviousVehicles.get('AUDI', 'A8', 2011);

        const estimated = await new VehicleEstimateService()._estimate(grouped, previous);
        // all of the estimated vehicles should have an object with keys -
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

        const actual = estimated[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();
        expect(actual.isDeviatedOldPrice).notOrBoolean();
        expect(actual.oldPrice).notOrNumber();

        const expected = {
            avgPrice: 8730000,
            oldPrice: 3000000,
            count: 1,
            deviationCount: 0,
            isDeviatedAvgPrice: true,
            isDeviatedOldPrice: true,
            mark: 'AUDI',
            model: 'A8',
            released: 2011,
        };

        expect(actual).toEqual(expected);
    });

    test('4. Estimate vehicle AUDI A8 2011', async () => {
        const grouped = MockGroupedVehicles.get('AUDI', 'A8', 2011);
        const previous = MockPreviousVehicles.get('AUDI', 'A8', 2011);

        const estimated = await new VehicleEstimateService()._estimate(grouped, previous);
        // all of the estimated vehicles should have an object with keys -
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

        const actual = estimated[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();
        expect(actual.isDeviatedOldPrice).notOrBoolean();
        expect(actual.oldPrice).notOrNumber();

        const expected = {
            avgPrice: 8730000,
            oldPrice: 3000000,
            count: 1,
            deviationCount: 0,
            isDeviatedAvgPrice: true,
            isDeviatedOldPrice: true,
            mark: 'AUDI',
            model: 'A8',
            released: 2011,
        };

        expect(actual).toEqual(expected);
    });

    test('5. Estimate vehicle NIVA 2121 2018', async () => {
        const grouped = MockGroupedVehicles.get('NIVA', '2121', 2018);
        const previous = MockPreviousVehicles.get('NIVA', '2121', 2018);

        const estimated = await new VehicleEstimateService()._estimate(grouped, previous);
        // all of the estimated vehicles should have an object with keys -
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

        const actual = estimated[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();
        expect(actual.isDeviatedOldPrice).notOrBoolean();
        expect(actual.oldPrice).notOrNumber();

        const expected = {
            avgPrice: 4231625,
            count: 5,
            deviationCount: 1,
            isDeviatedAvgPrice: true,
            isDeviatedOldPrice: false,
            mark: 'NIVA',
            model: '2121',
            oldPrice: 4300000,
            released: 2018,
        };

        expect(actual).toEqual(expected);
    });

    test('6. Estimate vehicle NIVA 2121 2017', async () => {
        const grouped = MockGroupedVehicles.get('NIVA', '2121', 2017);
        const previous = MockPreviousVehicles.get('NIVA', '2121', 2017);

        const estimated = await new VehicleEstimateService()._estimate(grouped, previous);
        // all of the estimated vehicles should have an object with keys -
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

        const actual = estimated[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();
        expect(actual.isDeviatedOldPrice).notOrBoolean();
        expect(actual.oldPrice).notOrNumber();

        const expected = {
            avgPrice: null,
            count: 5,
            deviationCount: 5,
            isDeviatedAvgPrice: true,
            isDeviatedOldPrice: true,
            mark: 'NIVA',
            model: '2121',
            oldPrice: 5000000,
            released: 2017,
        };

        expect(actual).toEqual(expected);
    });

    test('7. Estimate vehicle NIVA 2121 2006', async () => {
        const grouped = MockGroupedVehicles.get('NIVA', '2121', 2006);
        const previous = MockPreviousVehicles.get('NIVA', '2121', 2006);

        const estimated = await new VehicleEstimateService()._estimate(grouped, previous);
        // all of the estimated vehicles should have an object with keys -
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

        const actual = estimated[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();
        expect(actual.isDeviatedOldPrice).notOrBoolean();
        expect(actual.oldPrice).notOrNumber();

        const expected = {
            avgPrice: 1726600,
            oldPrice: 2000000,
            count: 10,
            deviationCount: 5,
            isDeviatedAvgPrice: true,
            isDeviatedOldPrice: true,
            mark: 'NIVA',
            model: '2121',
            released: 2006,
        };

        expect(actual).toEqual(expected);
    });

    test('8. Estimate vehicle VAZ(LADA) PRIORA 2006', async () => {
        const grouped = MockGroupedVehicles.get('VAZ(LADA)', 'PRIORA', 2006);
        const previous = MockPreviousVehicles.get('VAZ(LADA)', 'PRIORA', 2006);

        const estimated = await new VehicleEstimateService()._estimate(grouped, previous);
        // all of the estimated vehicles should have an object with keys -
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

        const actual = estimated[0];

        expect(actual).toBeObject();
        expect(_.keys(actual)).toEqual(expect.arrayContaining(keys));
        expect(actual.mark).toBeString();
        expect(actual.model).toBeString();
        expect(actual.avgPrice).toBeNumberOrNull();
        expect(actual.isDeviatedAvgPrice).toBeBoolean();
        expect(actual.released).toBeNumber();
        expect(actual.count).toBeNumber();
        expect(actual.deviationCount).toBeNumber();
        expect(actual.isDeviatedOldPrice).notOrBoolean();
        expect(actual.oldPrice).notOrNumber();

        const expected = {
            avgPrice: 1176125,
            count: 4,
            deviationCount: 0,
            isDeviatedAvgPrice: true,
            isDeviatedOldPrice: false,
            mark: 'VAZ(LADA)',
            model: 'PRIORA',
            oldPrice: 1176125,
            released: 2006,
        };

        expect(actual).toEqual(expected);
    });
});
