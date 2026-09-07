import { useEffect, useState } from 'react';

const FLOW_STATUS = {
  1: ['pending', 'Pago pendiente', 'Flow todavía está procesando el pago.'],
  2: ['success', 'Pago confirmado', 'Tu pago fue confirmado correctamente.'],
  3: ['error', 'Pago rechazado', 'El pago fue rechazado. Puedes intentar nuevamente.'],
  4: ['error', 'Pago anulado', 'El pago fue anulado.'],
  5: ['error', 'Pago expirado', 'La orden de pago expiró.']
};

export default function PaymentResult() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') !== 'result') return;
    const token = params.get('token');
    if (!token) {
      setState({ tone: 'error', title: 'No pudimos verificar el pago', message: 'Falta el token de Flow.' });
      return;
    }

    fetch(`/api/flow/status?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No fue posible consultar Flow.');
        const [tone, title, message] = FLOW_STATUS[data.status] || ['pending', 'Estado de pago recibido', 'Revisa la confirmación de Flow.'];
        setState({ tone, title, message, order: data.commerceOrder, amount: data.amount });
      })
      .catch((error) => setState({ tone: 'error', title: 'No pudimos verificar el pago', message: error.message }));
  }, []);

  if (!state) return null;
  return (
    <div className={`payment-result payment-result--${state.tone}`} role="status">
      <strong>{state.title}</strong>
      <p>{state.message}</p>
      {state.order && <small>Pedido: {state.order}</small>}
    </div>
  );
}
