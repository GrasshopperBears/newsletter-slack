# newsletter-slack

This is simpler server that you can subscribe newsletter and get notification by Slack.
It can be easily done with paid plan, but we can also do it for free!
You can subscribe multiple newsletters divided by your own category.
This notification system is using Slack app [Incoming Webhooks](https://jinwoo-personal.slack.com/apps/A0F7XDUAZ--?tab=more_info).
Slack provides 10 apps for free plan and one of them is going to be used by this service for error tracking. Thus, you can make 9 categories at maximum.

## Prerequisite

- Your own domain
- Server connected to your domain
  - MX record should be set. You can refer [this link](https://www.namecheap.com/support/knowledgebase/article.aspx/322/2237/how-can-i-set-up-mx-records-required-for-mail-service/) if you need.
  - `node` and `npm` should be installed.

## Settings

### Slack

1. Create Slack workspace where you want to get notification.
2. Create channels to get newsletter. Each channel means its category(e.g. Science, Business...).
3. Add `Incoming Webhooks` app for each channel ([how?](https://slack.com/help/articles/202035138-Add-apps-to-your-Slack-workspace)) and get webhook URL for each channel.
    - **One of them should be made for error message**

### Server

1. Clone this repository
    ```bash
    git clone https://github.com/GrasshopperBears/newsletter-slack
    ```
2. Create `.env` file at the root of this repository. There should be keys as below
    ```
    SLACK_WEBHOOK_ERROR=    # necessary

    SLACK_WEBHOOK_TECH=     # example
    SLACK_WEBHOOK_CULTURE=  # example
    ...

    SERVER_HOST=example.com
    MAIL_TO=newsletter      # example, username for newsletters.

    SAVE_MAIL_DIR=/home/newsletter/Maildir  # example
    ```
    You should fill in webhook urls at `.env` file.
    In this example, you will get newsletter by `newsletter@example.com`.
3. You can change configuration files(`subscription-list.js`, `webhook-url.js`) as you want.

## To run the server

```bash
npm i
npm i -g pm2
npm start
```
