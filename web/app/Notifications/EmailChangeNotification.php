<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\HtmlString;
use MilenMk\LaravelEmailChangeConfirmation\Notifications\EmailChangeConfirmation as BaseNotification;

class EmailChangeNotification extends BaseNotification
{
    protected function buildMailMessage(string $confirmUrl, string $denyUrl): MailMessage
    {
        return (new MailMessage)
            ->subject('Confirm Your Email Change')
            ->greeting('Hello!')
            ->line('We received a request to change the email address for your account to **' . $this->newEmail . '**. If you requested this change, please confirm it below.')
            ->action('Change Email', $confirmUrl)
            ->line('**Didn\'t request this change?** Click below to deny it and secure your account. These links expires in **' . config('email-change-confirmation.confirmation_email_expire_minutes') . ' minutes**.')
            ->line($this->buildDenyButton($denyUrl))
            ->line('This links expires in **' . config('email-change-confirmation.confirmation_email_expire_minutes') . ' minutes**.');
    }

    protected function buildDenyButton(string $denyUrl): HtmlString
    {
        $text = 'Deny Request';
        return new HtmlString(
            '<table class="action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'; position: relative; margin: 30px auto; padding: 0; text-align: center; width: 100%;">
                <tr>
                    <td align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'; position: relative;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'; position: relative;">
                            <tr>
                                <td align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'; position: relative;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'; position: relative;">
                                        <tr>
                                            <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'; position: relative;">
                                                <a href="' . $denyUrl . '" class="button button-red" target="_blank" rel="noopener" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'; position: relative; -webkit-text-size-adjust: none; border-radius: 4px; color: #fff; display: inline-block; overflow: hidden; text-decoration: none; background-color: #f47174; border-bottom: 8px solid #f47174; border-left: 18px solid #f47174; border-right: 18px solid #f47174; border-top: 8px solid #f47174;">' . $text . '</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>'
        );
    }
}
