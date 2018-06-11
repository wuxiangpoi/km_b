import modalService from './modalService'
import httpService from './httpService'
import baseService from './baseService'
import chartService from './chartService'
import leafService from './leafService'
import sentencesService from './sentencesService'


import dmbdRest from './dmbdRest';
import programService from './programService';
import templateService from './templateService';
import publicTemplateService from './publicTemplateService';
import imageService from './imageService';
import videoService from './videoService';
import audioService from './audioService';
import resourcePathService from './resourcePathService';


const services = [
    modalService,
    httpService,
    baseService,
    chartService,
    leafService,
    sentencesService,

    dmbdRest,
    programService,
    templateService,
    publicTemplateService,
    imageService,
    videoService,
    audioService,
    resourcePathService
];


export default app => {
    services.forEach(service => {
        service(app);
    })
};