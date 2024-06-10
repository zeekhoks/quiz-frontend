<template>
  <div>
    <h4>
      Please answer all questions. Once the submit button is clicked, the answer
      cannot be changed.
    </h4>
    <p>{{ data.question.question }}</p>
    <div v-for="option in data.question.options" :key="option.id">
      <input
        :id="option.id"
        type="radio"
        :value="option.value"
        :name="question.id"
        :checked="data.chosenAnswer == option.value"
        :disabled="!data.question.isEnabled"
        v-model="data.chosenAnswer"
        :required="true"
      /><label>{{ option.value }}</label>
    </div>

    <button
      class="btn-submit"
      v-show="isSubmit == 0"
      @click="
        handleSubmit(
          (questionId = data.question.question_id),
          data.chosenAnswer,
          (quizId = data.quiz.id)
        )
      "
    >
      Submit
    </button>
    <button
      class="btn-next"
      v-show="isSubmit == 1 && !isLastQuestion"
      @click="handleNext"
    >
      Next
    </button>
    <button
      class="btn-finish"
      v-show="isSubmit == 1 && isLastQuestion"
      @click="handleFinish"
    >
      Finish
    </button>
  </div>
</template>

<script>
import { ref, watch, reactive } from "vue";
import { submitResponse, finishQuiz } from "../../api";

export default {
  //   props: ["question", "isLastQuestion", "quiz_id", "chosenAnswer"],
  props: {
    question: {
      type: Object,
      default: null,
    },
    isLastQuestion: {
      type: Boolean,
      default: false,
    },
    quiz: {
      type: Object,
      default: null,
    },
    chosenAnswer: {
      type: String,
      default: "",
    },
  },
  setup(props, ctx) {
    var isSubmit = ref(0);
    // var chosenAnswer = ref(chosenAnswer);
    var responseArray = [];

    const data = reactive({
      question: props.question,
      isLastQuestion: props.isLastQuestion,
      chosenAnswer: props.chosenAnswer,
      quiz: props.quiz,
    });

    watch(
      () => props.chosenAnswer,
      (newValue) => {
        if (newValue) {
          data.chosenAnswer = props.chosenAnswer;
          console.log(data.chosenAnswer);
        }
      }
    );

    watch(
      () => props.question,
      (newValue) => {
        if (newValue) {
          data.question = props.question;
          console.log(data.question);
        }
      }
    );

    watch(
      () => props.isLastQuestion,
      (newValue) => {
        if (newValue) {
          data.isLastQuestion = props.isLastQuestion;
          console.log(data.isLastQuestion);
        }
      }
    );

    watch(
      () => props.quiz,
      (newValue) => {
        if (newValue) {
          data.quiz = props.quiz;
          console.log(data.quiz);
        }
      }
    );

    async function handleSubmit(questionId, chosenAnswer, quizId) {
      //   console.log(">>>>>>>>>>>>>>>>>>>>>");
      //   console.log(data.chosenAnswer);
      //   console.log(data.question.question_id);
      //   console.log(data.quiz.id);
      try {
        isSubmit.value = 1;
        responseArray.value = await submitResponse(
          data.question.question_id,
          data.chosenAnswer,
          data.quiz.id
        );
        console.log(responseArray);
        ctx.emit("submit-question", responseArray);
      } catch (error) {
        console.log(error);
      }
    }

    function handleNext() {
      isSubmit.value = 0;
      ctx.emit("next-question");
    }

    async function handleFinish() {
      try {
        isSubmit.value = 1;
        const response = await finishQuiz(data.quiz.id);
        // console.log(response);
        ctx.emit("finished-quiz", response);
      } catch (error) {
        console.log(error);
      }
    }

    return {
      props,
      data,
      isSubmit,
      handleSubmit,
      handleNext,
      handleFinish,
    };
  },
};
</script>

<style scoped>
.question-wrapper {
  margin-bottom: 10px;
}
.btn-submit,
.btn-next {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
