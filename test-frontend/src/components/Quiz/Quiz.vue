<template>
  <div class="search-form" v-if="isUserDashboard">
    <h3>User Dashboard</h3>
    <form name="search-topic" @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="topic">Enter your quiz topic: </label>
        <input id="topic" type="text" v-model="topic" required />
      </div>
      <button class="btn btn-outline-dark" type="submit">Search</button>
    </form>
  </div>

  <!-- <div v-if="displayAnswer">
    <p>Correct Answer: {{ correctAnswer }}</p>
    <p>Your Response: {{ userResponse }}</p>
    <p>Result: {{ result }}</p>
  </div> -->

 
    <div v-if="displayAnswer" id="answer-block"  :class="{ 'correct-answer': result === 'Right', 'wrong-answer': result === 'Wrong' }">
    <p>Correct Answer: {{ correctAnswer }}</p>
    <p>Your Response: {{ userResponse }}</p>
    <p>Result: {{ result }}</p>
  </div>
  
  


  <div v-show="isQuizFinished" class="finished-quiz" >
    <h3>Your quiz is completed! Here are your stats:</h3>
    <table class="stats-table">
      <tr>
        <th>Stat</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Number of questions</td>
        <td>{{ totalQuestions }}</td>
      </tr>
      <tr>
        <td>Number of questions attempted</td>
        <td>{{ totalAnsweredQuestions }}</td>
      </tr>
      <tr>
        <td>Number of correct answers</td>
        <td>{{ numberOfCorrectAnswers }}</td>
      </tr>
      <tr>
        <td>Your percentage</td>
        <td>{{ percentage }}</td>
      </tr>
    </table>
    <button type="submit" @click="backToLogin">Login</button>
</div>
  <Quizlet
    v-if="isQuizStarted"
    :quiz="quiz"
    :question="questions[questionNumber]"
    :chosenAnswer="questions[questionNumber].chosenAnswer"
    :isLastQuestion="isLastQuestion"
    @submit-question="handleSubmitQuestion($event)"
    @next-question="handleNextQuestion"
    @finished-quiz="handleFinishQuiz($event)"
  ></Quizlet>
</template>

<script>
import Quizlet from "./Quizlet.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { startQuiz } from "../../api";

export default {
  name: "Quiz",
  components: {
    Quizlet,
  },
  props: {},
  setup() {
    var questionNumber = ref(0);
    var isUserDashboard = ref(true);
    const questions = ref([]);
    const quiz = ref([]);
    let correctAnswer = ref("");
    let userResponse = ref("");
    let result = ref("");
    let displayAnswer = ref(false);
    let isQuizFinished = ref(false);
    let isQuizStarted = ref(false);
    var isUserDashboard = ref(true);
    var numberOfCorrectAnswers = ref(0);
    var percentage = ref(0.0);
    var totalQuestions = ref(0);
    var totalAnsweredQuestions = ref(0);

    const questions1 = ref([
      {
        id: 1,
        question: "hello there",
        options: [
          { id: 1, value: "one" },
          { id: 2, value: "two" },
          { id: 3, value: "three" },
        ],
        isEnabled: true,
        chosenAnswer: 1,
      },
      {
        id: 2,
        question: "hello there 2",
        options: [
          { id: 1, value: "one" },
          { id: 2, value: "two" },
          { id: 3, value: "three" },
        ],
        isEnabled: true,
        chosenAnswer: 1,
      },
    ]);

    const topic = ref("");
    const router = useRouter();

    async function handleSubmit() {
      let response = await startQuiz(topic.value);
      console.log(response);
      quiz.value = response.quiz;
      // console.log(quiz.value)
      questions.value = response.quiz.questions;
      let questionIdCounter = 1;

      questions.value = response.quiz.questions.map((question) => {
        let optionIdCounter = 1;
        const options = question.options.map((option) => ({
          id: optionIdCounter++,
          value: option,
        }));

        return {
          id: questionIdCounter++,
          question_id: question.id,
          question: question.question,
          options: options,
          isEnabled: true,
          chosenAnswer: question.options[0],
        };
      });

      console.log(questions.value);
      isUserDashboard.value = false;
      isQuizStarted.value = true;
      displayAnswer.value = false;
      isQuizFinished.value = false;
    }
    var isLastQuestion = ref(false);

    function handleSubmitQuestion(event) {
      questions.value[questionNumber.value].isEnabled = false;

      var correctAnswerReceived = event.value.result.correct_answer;
      correctAnswer.value = correctAnswerReceived;
      var userResponseReceived = event.value.result.response;
      userResponse.value = userResponseReceived;
      var resultReceived = event.value.result.result;
      result.value = resultReceived;
      displayAnswer.value = true;
      isUserDashboard.value = false;
      isQuizStarted.value = true;
      isQuizFinished.value = false;
      // console.log("Submitted Answer Event >>>>>>>>>>>", correctAnswer, userResponse, result);
    }

    function handleNextQuestion() {
      isUserDashboard.value = false;
      isQuizStarted.value = true;
      displayAnswer.value = false;
      isQuizFinished.value = false;
      if (questionNumber.value < questions.value.length - 1) {
        questionNumber.value += 1;
      }

      if (questionNumber.value == questions.value.length - 1) {
        console.log("Is last");
        isLastQuestion.value = true;
      }
    }

    function handleFinishQuiz(event) {
      isUserDashboard.value = false;
      isQuizStarted.value = false;
      displayAnswer.value = false;
      isQuizFinished.value = true;

      const correct_answers = event.stats.number_of_correct_answers;
      numberOfCorrectAnswers.value = correct_answers;
      const percentageReceived = event.stats.percentage;
      percentage.value = percentageReceived;
      const total_questions = event.stats.total_questions;
      totalQuestions.value = total_questions;
      const total_answered_questions = event.stats.total_questions_answered;
      totalAnsweredQuestions.value = total_answered_questions;
    }

    function backToLogin() {
      router.push("/");
    }

    return {
      questionNumber,
      questions,
      isLastQuestion,
      isUserDashboard,
      handleSubmitQuestion,
      handleNextQuestion,
      handleSubmit,
      topic,
      quiz,
      displayAnswer,
      correctAnswer,
      userResponse,
      result,
      handleFinishQuiz,
      isQuizFinished,
      isQuizStarted,
      backToLogin,
      totalAnsweredQuestions,
      totalQuestions,
      percentage,
      numberOfCorrectAnswers,
    };
  },
};
</script>

<style scoped>
.finished-quiz {
  margin-top: 20px;
  padding: 20px;
  width: 100%;
  text-align: center;
}

.finished-quiz button {
  margin-top: 20px;
  width: 30%;
  text-align: center;
}

.stats-table {
  margin-top: 20px;
  padding: 20px;
  border: 0.5px solid #ffffff;
  border-radius: 5px;
  width: 100%;
  /* margin-left: 25%; */
  text-align: center;
}

.correct-answer {
  background-color: #008000;
  border: 0.5px solid #ffffff;
  border-radius: 5px;
}

.wrong-answer {
  background-color: #8B0000;
  border: 0.5px solid #ffffff;
  border-radius: 5px;
}

#answer-block{
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 5px;
  display: flex;
  flex-direction: space-between;
  gap: 10%;
  width: 100%;
}
</style>
