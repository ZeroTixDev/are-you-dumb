'use strict';

require('./style.css');

Array.prototype.shuffle = function () {
   const array = this;
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
   }
   return array;
};

const ref = require('./references.js');
const game = require('./quiz.json');
const state = { questions: game.quiz.length, quiz: game.quiz.shuffle(), questionIndex: 0, typingSpeed: 15 };

state.init = function (index) {
   ref.gameContent.innerHTML = '';
   state.questionIndex = index;
   if (ref.questionCounter.classList.contains('hidden')) {
      ref.questionCounter.classList.remove('hidden');
      ref.questionCounter.innerHTML = `${state.questionIndex}/${state.questions}`;
   }
   makeQuestion(state.quiz[index], ref.gameContent);
};

window.addEventListener('load', () => {
   ref.menu.classList.remove('hidden');
});

ref.playButton.addEventListener('click', () => {
   ref.menu.classList.add('hidden');
   ref.game.classList.remove('hidden');
   typeWriter(game.startText, ref.gameStartText);
});

function typeWriter(text, element) {
   element.innerHTML = '';
   function type(i = 0) {
      if (i < text.length) {
         element.innerHTML += text.charAt(i);
         setTimeout(() => type(i + 1), 1000 / state.typingSpeed);
      } else {
         setTimeout(() => {
            state.init(state.questionIndex);
         }, 500);
         return;
      }
   }
   type();
}

function colorize(text) {
   if (text === 'red') {
      return '#c93734';
   } else if (text === 'blue') {
      return '#5981d9';
   } else if (text === 'yellow') {
      return '#cdd156';
   } else if (text === 'green') {
      return '#5dc750';
   } else if (text === 'cyan') {
      return '#8cdbda';
   }
   return null;
}

function makeQuestion(problem, element) {
   element.innerHTML += `<h1 class="question">${problem.question}</h1>`;
   const answers = [...problem.answers]
      .shuffle()
      .reduce(
         (old, answer) =>
            old +
            `<div class="answer" style="background-color: ${colorize(answer.color) ?? colorize('red')}">${
               answer.name
            }</div>`,
         ``
      );
   element.innerHTML += `<div class="answers">${answers}</div>`;
}
