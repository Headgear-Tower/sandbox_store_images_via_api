import http from "./httpService";
const apiEndpoint = "http://localhost:3000/api/job";
const localStorageTokenKey = "jwtToken";

// GET JOB SUMMARY
export async function jobDetailsAbridged(propertyNumber, postCode) {
  if (propertyNumber && postCode) {
    try {
      const { data: job } = await http.get(
        `${apiEndpoint}/summary?propertyNumber=${propertyNumber}&postCode=${postCode}`
      );

      return {
        data: job,
      };
    } catch (ex) {
      console.log(ex);
    }
  }
}

// POST FEEDBACK BY JOB ID
export async function postFeedbackById(id, feedbackKeyPair) {
  console.log(feedbackKeyPair);
  http.setJwt(getJwt());
  console.log(id);
  const { data: feedback } = await http.post(
    `${apiEndpoint}/review/${id}`,
    feedbackKeyPair
  );

  return {
    data: feedback,
  };

  //if (id && feedback) {
  // try {
  //   console.log(feedback);

  //   // const { data: feedback } = await http.post(
  //   //   `${apiEndpoint}/feedback/?id=${id}`,
  //   //   { feedback }
  //   // );

  //   return {
  //     data: feedback,
  //   };
  // } catch (ex) {
  //   console.log(ex);
  // }
  //}
}

// Get JWT from Local Browser Storage
export function getJwt() {
  return localStorage.getItem(localStorageTokenKey);
}
