/* ///////////////////
Object of all CVs for each stage
As of now, skills are scaled out of 10
*/// /////////////////

import CLASSES from '../../controllers/constants/classes';

const cvCollection = {
    cvFeatures: [
        {
            name: 'Skill',
            class: CLASSES.CV_SKILL,
        },
        {
            name: 'School Prestige',
            class: CLASSES.CV_SCHOOL,
        },
        {
            name: 'Work Experience',
            class: CLASSES.CV_WORK,
        },
        {
            name: 'Ambition',
            class: CLASSES.CV_AMBITION,
        },
    ],
    smallOfficeStage: [
        {
            name: '0 Remi Gottlieb',
            qualifications: [5, 7, 8, 9],
        },
        {
            name: '1 Jane Doe',
            qualifications: [10, 10, 10, 10],
        },

        {
            name: '2 Ellie-Louise Douglas',
            qualifications: [10, 8, 10, 10],
        },
        {
            name: '3 Suhail Brett',
            qualifications: [7, 10, 7, 10],
        },
        {
            name: '4 Jorgie Davie',
            qualifications: [10, 10, 10, 10],
        },
        {
            name: '5 Christos Knott',
            qualifications: [9, 7, 6, 5],
        },
        {
            name: '6 Ezra Burt',
            qualifications: [10, 10, 10, 10],
        },
        {
            name: '7 Franciszek Pugh',
            qualifications: [10, 3, 2, 10],
        },
        {
            name: '8 Wojciech Milner',
            qualifications: [8, 6, 10, 4],
        },
        {
            name: '9 Kobe Gough',
            qualifications: [8, 4, 5, 1],
        },
        {
            name: '10 Maximilian Merritt',
            qualifications: [10, 9, 9, 1],
        },
        {
            name: '11 Minahil Maldonado',
            qualifications: [8, 8, 8, 1],
        },
        {
            name: '12 Danyaal Acevedo',
            qualifications: [10, 4, 5, 2],
        },
        {
            name: '13 Jacqueline Page',
            qualifications: [8, 4, 5, 10],
        },
        {
            name: '14 Laibah Croft',
            qualifications: [9, 9, 5, 10],
        },
        {
            name: '15 Katrina Roberts',
            qualifications: [3, 9, 10, 1],
        },
        {
            name: '16 Ottilie Bright',
            qualifications: [8, 4, 5, 1],
        },
        {
            name: '17 Jesus Hibbert',
            qualifications: [10, 10, 10, 10],
        }
    ],
};

export {cvCollection};
