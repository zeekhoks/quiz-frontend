<template>
  <div v-if="isAdmin == 'true'">
    <h3>Admin Dashboard</h3>
    <div class="document-form">
      <form name="document-upload" @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="file">Upload your questions file here: </label>
          <input id="file" type="file" @change="handleFileUpload" required accept=".json"/>
          <div class="mb-3">
            <label for="topic">Please add your topic here: </label>
            <input id="topic" type="text" v-model="topic" required pattern="[a-zA-Z0-9\s]+" minlength="3" maxlength="50"/>
          </div>
          <button
              class="btn btn-outline-dark"
              :disabled="isUploaded"
              type="submit"
            >
              Upload
            </button>
        </div>
      </form>
    </div>
  </div>
  <div v-else>
    You are not admin!
  </div>
  
</template>

<script>
import { ref } from "vue";
import { uploadQuiz } from "../../api.js";
import { useRouter } from "vue-router";

export default{
    setup(){

        const topic=ref("");
        var file = ref();
        const router = useRouter();
        const isUploaded = ref(false);

        async function handleSubmit() {
          const response = await uploadQuiz(topic.value, file.value)
          if(response && response.number_of_questions_inserted>0){
            isUploaded.value=true;
            alert("File Uploaded Successfully!")
            router.push("/")
          } else {
            alert("File Not Uploaded Successfully. Please try again.")
            router.push("/admin")
          }
        }

        function handleFileUpload(event) {
          file.value = event.target.files[0]
        }

        var isAdmin = sessionStorage.getItem("isAdmin")

        return{
            topic,
            isAdmin,
            handleSubmit,
            handleFileUpload,
            isUploaded
        }
    }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.document-form{
  display: flex;
  flex-direction: column;
}
</style>
