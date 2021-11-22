import _ from 'lodash';
export default class MockPreviousVehicles {
    static get(mark, model, released) {
        const vehicles = [
            {
                mark: 'AUDI',
                model: 'Q7',
                avgPrice: 5335000,
                isDeviatedAvgPrice: true,
                released: 2007,
                count: 1,
                deviationCount: 0,
                acceptedPrice: 5335000,
            },
            {
                mark: 'AUDI',
                model: 'Q7',
                avgPrice: 6717250,
                isDeviatedAvgPrice: true,
                released: 2009,
                count: 2,
                deviationCount: 0,
                acceptedPrice: 6700000,
            },
            {
                mark: 'AUDI',
                model: 'Q7',
                avgPrice: 14065000,
                isDeviatedAvgPrice: true,
                released: 2019,
                count: 4,
                deviationCount: 3,
                acceptedPrice: 140670000,
            },
            {
                mark: 'AUDI',
                model: 'A6',
                avgPrice: 1309500,
                isDeviatedAvgPrice: true,
                released: 2000,
                count: 1,
                deviationCount: 0,
                acceptedPrice: 2500000,
            },
            {
                mark: 'AUDI',
                model: 'A6',
                avgPrice: 3661750,
                isDeviatedAvgPrice: true,
                released: 2005,
                count: 4,
                deviationCount: 0,
                acceptedPrice: 3600000,
            },
            {
                mark: 'AUDI',
                model: 'A6',
                avgPrice: 5092500,
                isDeviatedAvgPrice: true,
                released: 2008,
                count: 1,
                deviationCount: 0,
                acceptedPrice: 500000,
            },
            {
                mark: 'AUDI',
                model: 'A6',
                avgPrice: 4753000,
                isDeviatedAvgPrice: true,
                released: 2009,
                count: 4,
                deviationCount: 0,
                acceptedPrice: 4753000,
            },
            {
                mark: 'AUDI',
                model: 'A4',
                avgPrice: 2684332,
                isDeviatedAvgPrice: false,
                released: 2007,
                count: 21,
                deviationCount: 4,
                isDeviatedOldPrice: false,
                acceptedPrice: 2800000,
                oldPrice: 2750000,
            },
            {
                mark: 'AUDI',
                model: 'A8',
                avgPrice: 8730000,
                isDeviatedAvgPrice: true,
                released: 2011,
                count: 1,
                deviationCount: 0,
                acceptedPrice: 3000000,
            },
            {
                mark: 'VAZ(LADA)',
                model: 'PRIORA',
                avgPrice: 1212500,
                isDeviatedAvgPrice: true,
                released: 2000,
                count: 1,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 1212500,
                oldPrice: 0,
            },
            {
                mark: 'VAZ(LADA)',
                model: 'PRIORA',
                avgPrice: 873000,
                isDeviatedAvgPrice: true,
                released: 2003,
                count: 2,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 873000,
                oldPrice: 0,
            },
            {
                mark: 'VAZ(LADA)',
                model: 'PRIORA',
                avgPrice: 897250,
                isDeviatedAvgPrice: true,
                released: 2004,
                count: 1,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 873000,
                oldPrice: 0,
            },
            {
                mark: 'VAZ(LADA)',
                model: 'PRIORA',
                avgPrice: 1176125,
                isDeviatedAvgPrice: true,
                released: 2006,
                count: 4,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 1176125,
                oldPrice: 0,
            },
            {
                mark: 'VAZ(LADA)',
                model: 'PRIORA',
                avgPrice: 872758,
                isDeviatedAvgPrice: true,
                released: 2007,
                count: 2,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 872758,
                oldPrice: 0,
            },
            {
                mark: 'VAZ(LADA)',
                model: 'PRIORA',
                avgPrice: 1115500,
                isDeviatedAvgPrice: true,
                released: 2008,
                count: 4,
                deviationCount: 3,
                isDeviatedOldPrice: false,
                acceptedPrice: 1115500,
                oldPrice: 0,
            },
            {
                mark: 'VAZ(LADA)',
                model: 'PRIORA',
                avgPrice: 1115500,
                isDeviatedAvgPrice: true,
                released: 2009,
                count: 1,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 1000000,
                oldPrice: 0,
            },
            {
                mark: 'VAZ(LADA)',
                model: 'PRIORA',
                avgPrice: 824500,
                isDeviatedAvgPrice: true,
                released: 2011,
                count: 1,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 824500,
                oldPrice: 0,
            },
            {
                mark: 'VAZ(LADA)',
                model: 'PRIORA',
                avgPrice: 2085500,
                isDeviatedAvgPrice: true,
                released: 2012,
                count: 1,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 2085500,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 1333750,
                isDeviatedAvgPrice: true,
                released: 2000,
                count: 2,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 1333750,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 1455000,
                isDeviatedAvgPrice: true,
                released: 2001,
                count: 2,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 1455000,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 1532600,
                isDeviatedAvgPrice: true,
                released: 2002,
                count: 5,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 1532600,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 1576250,
                isDeviatedAvgPrice: true,
                released: 2003,
                count: 2,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 1532600,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 1588375,
                isDeviatedAvgPrice: true,
                released: 2004,
                count: 6,
                deviationCount: 2,
                isDeviatedOldPrice: false,
                acceptedPrice: 1532600,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 1539875,
                isDeviatedAvgPrice: true,
                released: 2005,
                count: 6,
                deviationCount: 2,
                isDeviatedOldPrice: false,
                acceptedPrice: 1532600,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 3726600,
                isDeviatedAvgPrice: true,
                released: 2006,
                count: 10,
                deviationCount: 5,
                isDeviatedOldPrice: false,
                acceptedPrice: 2000000,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 1942156,
                isDeviatedAvgPrice: true,
                released: 2007,
                count: 14,
                deviationCount: 5,
                isDeviatedOldPrice: false,
                acceptedPrice: 1900000,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 2137464,
                isDeviatedAvgPrice: false,
                released: 2008,
                count: 15,
                deviationCount: 1,
                isDeviatedOldPrice: false,
                acceptedPrice: 2137464,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 2231000,
                isDeviatedAvgPrice: true,
                released: 2010,
                count: 4,
                deviationCount: 2,
                isDeviatedOldPrice: false,
                acceptedPrice: 2231000,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 2328000,
                isDeviatedAvgPrice: true,
                released: 2011,
                count: 2,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 2231000,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 2473500,
                isDeviatedAvgPrice: true,
                released: 2012,
                count: 2,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 2231000,
                oldPrice: 0,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 3168667,
                isDeviatedAvgPrice: true,
                released: 2015,
                count: 3,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 2231000,
                oldPrice: 2800000,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 4146750,
                isDeviatedAvgPrice: true,
                released: 2016,
                count: 5,
                deviationCount: 1,
                isDeviatedOldPrice: false,
                acceptedPrice: 4146750,
                oldPrice: 3300000,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: null,
                isDeviatedAvgPrice: true,
                released: 2017,
                count: 5,
                deviationCount: 5,
                isDeviatedOldPrice: false,
                acceptedPrice: 5000000,
                oldPrice: 3300000,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 4231625,
                isDeviatedAvgPrice: true,
                released: 2018,
                count: 5,
                deviationCount: 1,
                isDeviatedOldPrice: false,
                acceptedPrice: 4300000,
                oldPrice: 3800000,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 4656000,
                isDeviatedAvgPrice: true,
                released: 2019,
                count: 3,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 4500000,
                oldPrice: 4000000,
            },
            {
                mark: 'NIVA',
                model: '2121',
                avgPrice: 5205667,
                isDeviatedAvgPrice: true,
                released: 2020,
                count: 3,
                deviationCount: 0,
                isDeviatedOldPrice: false,
                acceptedPrice: 5205667,
                oldPrice: 0,
            }
        ];

        return _.filter(vehicles, { mark, model, released });
    }
}