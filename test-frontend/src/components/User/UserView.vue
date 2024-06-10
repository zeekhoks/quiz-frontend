<template>
  <h3>User Dashboard</h3>
  <div class="search-form">
    <form name="search-topic" @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="topic">Enter your quiz topic: </label>
        <input id="topic" type="text" v-model="topic" />
      </div>
      <button class="btn btn-outline-dark" type="submit">Search</button>
    </form>
  </div>
</template>
<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { startQuiz } from "../../api";
export default {
  name: "UserView",
  setup() {
    const topic = ref("");
    const router = useRouter();

    async function handleSubmit() {
      let response = await startQuiz(topic.value);
      var intermediateQuestions = response.quiz.questions;
      // router.push("/quiz");
      router.push({
        name: 'Quiz',
        params: {
          data: JSON.stringify(intermediateQuestions)
        }
      })
      router.push({
        path: "/quiz"
      });
    }

    return {
      topic,
      handleSubmit,
      router,
    };
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.search-form {
  display: flex;
  flex-direction: column;
}
</style>
