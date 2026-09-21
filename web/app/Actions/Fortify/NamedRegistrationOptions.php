<?php

namespace App\Actions\Fortify;

use Laravel\Passkeys\Actions\GenerateRegistrationOptions;
use Laravel\Passkeys\Passkeys;
use Webauthn\PublicKeyCredentialRpEntity;

class NamedRegistrationOptions extends GenerateRegistrationOptions
{
    protected function relyingParty(): PublicKeyCredentialRpEntity
    {
        return PublicKeyCredentialRpEntity::create(
            name: config('app.name'),
            id: Passkeys::relyingPartyId()
        );
    }
}
