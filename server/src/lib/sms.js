// Astrazione per l'invio dell'SMS con il codice OTP.
//
// Se sono presenti le variabili d'ambiente TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e
// TWILIO_FROM_NUMBER viene usato l'API REST di Twilio per l'invio reale. In assenza di
// credenziali (modalità demo) il codice viene solo loggato lato server e restituito al
// client dalla route di richiesta OTP, così l'app resta interamente testabile senza un
// account SMS a pagamento. Per passare all'invio reale basta valorizzare le tre variabili
// d'ambiente: nessuna modifica al codice è necessaria.

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;

export const smsProviderConfigured = Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER);

/**
 * Invia il codice OTP via SMS. Ritorna { sent, devCode } dove devCode è valorizzato
 * solo quando non è configurato alcun provider reale (modalità demo).
 */
export async function sendOtpSms(phoneE164, code) {
  if (!smsProviderConfigured) {
    console.log(`[SMS DEV] Codice di verifica per ${phoneE164}: ${code}`);
    return { sent: false, devCode: code };
  }

  const body = new URLSearchParams({
    To: phoneE164,
    From: TWILIO_FROM_NUMBER,
    Body: `Il tuo codice Aria è ${code}. Scade tra 5 minuti.`,
  });

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Invio SMS fallito (${res.status}): ${detail}`);
  }

  return { sent: true, devCode: null };
}
