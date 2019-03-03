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
            name: 'Remi Gottlieb',
            qualifications: [5, 7, 8, 9],
        },
        {
            name: 'Jane Doe',
            qualifications: [10, 10, 10, 10],
        },
    ],
};

export {cvCollection};
