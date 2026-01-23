// Успешный ответ при запросе на логин

export type LoginResponseType = {
  accessToken: string
  refreshToken: string,
  userId: string
}
