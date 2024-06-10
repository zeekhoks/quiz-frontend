<template>
  <h3>Questions</h3>
  <div class="quiz-questions">

    <section class="quiz" v-if="!quizCompleted">
      <div class="quiz-info">
        <span class="question">{{ getCurrentQuestion.question }}</span>
        <!-- <span class="score">Score {{ score }}/{{ questions.length }}</span> -->
      </div>

      <div class="options">
        <p>{{ selectedOption }}</p>
        <label
          v-for="(option, index) in getCurrentQuestion.options"
          :for="'option' + index"
        >
          <input
            type="radio"
            :id="'option' + index"
            :name="option"
            :value="option"
            v-model="selectedOption"
            @change="SetAnswer"
          />
          <span>{{ option }}</span>
        </label>
      </div>

      <button @click="NextQuestion" :disabled="!selectedOption">
        {{
          getCurrentQuestion.index == questions.length - 1
            ? "Finish"
            : selectedOption == null
            ? "Select an option"
            : "Next question"
        }}
      </button>
    </section>

    <section v-else>
      <h2>You have finished the quiz!</h2>
      <p>Your score is {{ score }}/{{ questions.length }}</p>
    </section>
  </div>
</template>
<script>
import { ref, computed } from "vue";
export default {
  name: "TestView",
  setup() {
    const questions = ref([
      {
        question: "What is the best TV show?",
        options: [
          "Friends",
          "Brooklyn Nine Nine",
          "Schitts Creek",
          "Modern Family",
        ],
        correct_answer: "Brooklyn Nine Nine",
      },
      {
        question: "What is math?",
        options: [
          "Numbers",
          "Addition",
          "Operations",
          "All of the above",
        ],
        correct_answer: "All of the above",
      },
      {
        question: "What is basic unit of a living being?",
        options: [
          "Animals",
          "Plants",
          "Atoms",
          "Neutrons",
        ],
        correct_answer: "Atoms",
      }
    ]);
    const score = computed(() => {
	let value = 0
	questions.value.map(q => {
		if (selectedOption.value != null && q.correct_answer == selectedOption.value) {
			console.log('correct');
			value++
		}
	})
	return value
})
    const quizCompleted = ref(false);
    const currentQuestion = ref(0);
    let selectedOption = ref("");
    // let getSelectedOption = "";

    const getCurrentQuestion = computed(() => {
      let question = questions.value[currentQuestion.value];
      question.index = currentQuestion.value;
      return question;
    });

    const SetAnswer = (e) => {
      selectedOption.value = e.target.value;
      console.log(selectedOption.value);
      e.target.value = null;
    };

    const NextQuestion = () => {
      if (currentQuestion.value < questions.value.length - 1) {
        currentQuestion.value++;
        return;
      }
      quizCompleted.value = true;
    };
    return {
      questions,
      selectedOption,
      getCurrentQuestion,
      SetAnswer,
      NextQuestion,
      quizCompleted,
      currentQuestion,
      score
    };
  },
};
</script>
<style></style>
