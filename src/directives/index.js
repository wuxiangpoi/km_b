import headerBar from './headerBar'
import siderBar from './siderBar'
import kmSelect from './kmSelect'
import eCharts from './eCharts'
import meInclude from './meInclude'
import meLazyload from './me-lazyload.js'
import upload from './upload'
import zTree from './zTree.js'
import newGroupSelect from './newGroupSelect'
import groupSelect from './groupSelect'
import imageView from './imageView'
import kmAudio from './kmAudio'
import imageThum from './imageThum'
import eInstructions from './eInstructions'



import dmbdPager from './pager/dmbdPager';
import imageViewer2 from './imageViewer/imageViewer2';
import videoViewer2 from './videoViewer/videoViewer2';
import audioViewer2 from './audioViewer/audioViewer2';
import dmbdProgramPreview2 from './programPreview/dmbdProgramPreview2';

const directives = [headerBar,
    siderBar,
    kmSelect,
    eCharts,
    meInclude,
    meLazyload,
    upload,
    zTree,
    groupSelect,
    newGroupSelect,
    imageView,
    kmAudio,
    imageThum,
    eInstructions,
    dmbdPager,
    imageViewer2,
    videoViewer2,
    audioViewer2,
    dmbdProgramPreview2
];

export default app => {
    directives.forEach(directive => {
        directive(app);
    })
};