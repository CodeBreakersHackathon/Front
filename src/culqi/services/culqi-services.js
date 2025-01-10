import { checkoutConfig } from "../config";
import { post } from "./util/api-connector";
import { culqiPathName } from "./util/http.constants";

const getEpochSeconds = (date) => {
  date.setDate(date.getDate() + 1);
  return Math.floor(date.getTime() / 1000);
};

const generateOrderRequest = (itemInfo, customer, total_amount, expiration) => {
  return {
    amount: total_amount,
    currency_code: checkoutConfig.CURRENCY,
    description: itemInfo.description,
    order_number: itemInfo.order,
    client_details: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      phone_number: customer.phone
    },
    expiration_date: expiration
  };
};

export const createOrder = async (itemInfo, customerInfo, total_amount, expiration) => {
  const bodyRequest = generateOrderRequest(itemInfo, customerInfo, total_amount, getEpochSeconds(expiration));
  const { data, status } = await post(culqiPathName.order, bodyRequest);

  if (status === 200 || status === 201) {
    return { data, status };
  }
  return { data, status };
};

const generateChargeRequest = ({ customer, total_amount, tokenId, deviceId }) => {;
  return {
    amount: total_amount,
    currency_code: checkoutConfig.CURRENCY,
    email: customer.email,
    source_id: tokenId,
    antifraud_details: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      phone_number: customer.phone,
      device_finger_print_id: deviceId
    }
  };
};

export const createCharge = async ({
  customer,
  email,
  total_amount,
  tokenId,
  deviceId,
  parameters3DS = null
}) => {
  const bodyRequest = generateChargeRequest({ customer, total_amount, email, tokenId, deviceId });

  const payload = parameters3DS
    ? { ...bodyRequest, authentication_3DS: { ...parameters3DS } }
    : bodyRequest;
  console.log("charge:", payload)
  const { data, status } = await post(culqiPathName.charge, payload);

  if (status === 200 || status === 201) {
    return { data, status };
  }
  return { data, status };
};

const generateCardRequest = ({ customerId, tokenId, deviceId }) => ({
  customer_id: customerId,
  token_id: tokenId,
  device_finger_print_id: deviceId
});

export const createCard = async ({
  customerId,
  tokenId,
  deviceId,
  parameters3DS = null
}) => {
  const bodyRequest = generateCardRequest({ customerId, tokenId, deviceId });
  const payload = parameters3DS
    ? { ...bodyRequest, authentication_3DS: { ...parameters3DS } }
    : bodyRequest;
  return post(culqiPathName.card, payload);
};

export const createCustomer = async ({
  firstName,
  lastName,
  email,
  address,
  addressCity,
  phone
}) => {
  return post(culqiPathName.customer, {
    first_name: firstName,
    last_name: lastName,
    email: email,
    address: address,
    address_city: addressCity,
    country_code: checkoutConfig.COUNTRY_CODE,
    phone_number: phone
  });
};
