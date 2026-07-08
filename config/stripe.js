import Stripe from 'stripe';

let _stripe = null;

function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY missing in env');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }
  return _stripe;
}

export default new Proxy({}, {
  get: (_, prop) => {
    const instance = getStripe();
    const value = instance[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});
