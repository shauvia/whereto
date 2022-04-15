import './styles/reset.scss'
import './styles/style.scss'
import './styles/mediaQuery.scss'
import {initializeForms} from  './js/app.js'
import {saveTripHandler} from './js/app.js'

document.getElementById('sendButton').addEventListener('click', saveTripHandler);
initializeForms();

