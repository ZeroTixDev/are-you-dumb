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
const state = {
   questions: game.quizLength,
   quiz: game.quiz.shuffle(),
   questionIndex: 0,
   typingSpeed: 20,
   questionsDone: 0,
   questionsCorrect: 0,
   done: false,
};

state.init = function (index) {
   if (state.done) return;
   ref.gameContent.innerHTML = '';
   state.questionIndex = index;
   if (ref.questionCounter.classList.contains('hidden')) {
      ref.questionCounter.classList.remove('hidden');
   }
   ref.questionCounter.innerHTML = `${state.questionsDone}/${state.questions}`;
   if (index >= state.questions) {
      // quiz is done, end screen
      state.done = true;
      ref.questionCounter.innerHTML = `DUMB`;
      ref.gameContent.innerHTML = '<h1 class="startText" style="font-size: 1rem;"></h1>';
      typeWriter(
         `Hello, it is I, ZeroTix, here to tell you the score you got.. only ${
            (state.questionsCorrect / state.questions) * 100
         }% accuracy? This is just the easiest version.. WOW you are really are DUMB huh? YOU FAILED`,
         document.querySelector('.game .content .startText')
      );
      return;
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
   } else if (text === 'brown') {
      return '#52241c';
   }
   return null;
}

function makeQuestion(problem, element) {
   element.innerHTML += `<h1 class="question">${problem.question}</h1>`;
   const answers = [...problem.answers];
   const divs = [];
   let boxDiv = null;
   for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const div = document.createElement('div');
      div.addEventListener('click', () => {
         if (answer.correct) {
            state.questionsCorrect++;
         }
         state.questionsDone++;
         state.questionIndex++;
         ref.gameContent.innerHTML = '<h1 class="startText"></h1>';
         ref.questionCounter.innerHTML = `${state.questionsDone}/${state.questions}`;
         typeWriter(
            answer.correct ? problem.correctText : problem.wrongText,
            document.querySelector('.game .content .startText')
         );
      });
      div.classList.add('answer');
      div.style.backgroundColor = colorize(answer.color) ?? colorize('red');
      div.innerText = answer.name;
      divs.push(div);
   }
   if (divs.length === 2) {
      boxDiv = document.createElement('div');
      boxDiv.classList.add('answers');
      boxDiv.style.height = '250px';
      appendElements(divs, boxDiv);
   }
   const answerBox = document.createElement('div');
   answerBox.classList.add('answers');
   if (boxDiv) {
      appendElements([boxDiv], answerBox);
   }
   appendElements([answerBox], element);
   if (boxDiv) {
      appendElements(divs, boxDiv);
   } else {
      appendElements(divs, answerBox);
   }
}

function appendElements(children, parent) {
   for (let i = 0; i < children.length; i++) {
      parent.appendChild(children[i]);
   }
}
