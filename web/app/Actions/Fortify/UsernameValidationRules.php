<?php

namespace App\Actions\Fortify;

trait UsernameValidationRules
{
    protected function usernameRules(): array
    {
        return [
            'required',
            'string',
            'min:5',
            'max:25',
            'regex:/^[a-z]+$/i',
        ];
    }
}
