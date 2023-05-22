import dotenv from 'dotenv'
import pkg from "@slack/bolt"
import { CronJob } from "cron"
import { FakeApi } from "./api/fakeApi.js";
dotenv.config()
const { App } = pkg

const token = process.env.TOKEN
const signingSecret =  process.env.SECRET

const slackApp = new App({
  token,
  signingSecret
})

const sendNotification = new CronJob(
  '0 0 * * *',                                                                     // Задача будет выполняться ежедневно в 00:00
  async () => {
    const serverData = await FakeApi.fetchData()                                  // Запрос на сервер

    if (serverData.length) {                                                      //Проверяем есть ли записи о днях рождения сотрудников
      for (let i = 0; i < serverData.length; i++) {                               // Делаем рассылку для каждого руководителя

        const { user } = await slackApp.client.users.lookupByEmail({             // Получаем данные о нашем руководителе по email
          token,
          email: serverData[i].rukovoditel
        })
        if (user?.id) {
          const names: string[] = []
          for (const key in serverData[i].sotrudniki) {                          // Достаем имена сотрудников 
            names.push(serverData[i].sotrudniki[key].name)
          }
          await slackApp.client.chat.postMessage({                              // Отправляем сообщение руководителю о днях рождениях
            token,   
            channel: user.id,
            text: `У ваших сотрудников день рождение: ${names.join(", ")}`
          })
        }
      }
    }
  },
  null,
  true
)