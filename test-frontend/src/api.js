import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api/";
export async function login(encodedUser) {
  return await axios
    .post(
      baseUrl + "login",
      {},
      { headers: { Authorization: `Basic ${encodedUser}` } }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error making API call to log in:");
      console.log(error);
    });
}

export async function uploadQuiz(topic, file) {
  const formData = new FormData();
  formData.append("bytes", file);

  return await axios
    .post(
      baseUrl + "questions",
      { topic: topic, questions_file: file },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((response) => {
      
      return response.data;
    })
    .catch((error) => {
      console.log("Error making API call to upload:");
      console.log(error);
    });
}

export async function startQuiz(topic) {
  return await axios
    .post(baseUrl + "quiz", null, {
      params: { topic: topic },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Could not send questions");
      if(error.response.status === 401){
        alert("Session expired. Please login again.");
        window.location.href = "/";
      }
    });
}

export async function submitResponse(question_id, choice, quizId) {
    console.log("QuizID" + quizId)
    console.log("Choice" + choice)
    console.log("Question Id" + question_id,)
  return await axios
    .post(
      baseUrl + "quiz/" + quizId + "/response",
      { question_id: question_id, choice: choice },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      // console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log("Could not send response");
      console.log(error);
    });
}

export async function finishQuiz(quizId) {
return await axios
  .get(
    baseUrl + "quiz/" + quizId + "/result",
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  )
  .then((response) => {
    console.log(response.data);
    return response.data;
  })
  .catch((error) => {
    console.log("Could not send quiz result");
    console.log(error);
  });
}
