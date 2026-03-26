export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData.trim();
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData && typeof responseData === "object") {
    const firstMessage = Object.values(responseData).find(
      (value) => typeof value === "string" && value.trim()
    );

    if (firstMessage) {
      return firstMessage.trim();
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
}
