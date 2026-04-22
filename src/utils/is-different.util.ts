import { isArray, isEmpty, isObject, pick } from 'lodash';

export const isDifferent = (a: any, b: any, properties?: Array<string | number | symbol>) => {
  if (properties && properties.length > 0) {
    a = pick(a, properties);
    b = pick(b, properties);
  }
  // Kiểm tra nếu cả a và b đều là undefined, null, đối tượng rỗng, hoặc mảng rỗng thì trả về false
  if (
    (a === undefined || a === null || (isObject(a) && isEmpty(a)) || (isArray(a) && isEmpty(a))) &&
    (b === undefined || b === null || (isObject(b) && isEmpty(b)) || (isArray(b) && isEmpty(b)))
  ) {
    return false;
  }

  // Xử lý trường hợp a hoặc b là đối tượng rỗng hoặc chỉ chứa các giá trị undefined
  // @ts-ignore
  const isEmptyOrUndefinedObject = (obj: any) =>
    isObject(obj) &&
    Object.keys(obj).every(
      (key) =>
        // @ts-ignore
        obj[key] === undefined ||
        // @ts-ignore
        (isObject(obj[key]) && isEmptyOrUndefinedObject(obj[key])) ||
        // @ts-ignore
        (isArray(obj[key]) && isEmpty(obj[key])),
    );

  if (isEmptyOrUndefinedObject(a) && isEmptyOrUndefinedObject(b)) {
    return false;
  }

  // Kiểm tra nếu b là mảng
  if (isArray(b)) {
    if (isArray(a) && a.length === b.length) {
      for (let i = 0; i < b.length; i++) {
        if (isDifferent(a[i], b[i])) {
          return true;
        }
      }
      return false;
    }

    // Nếu `a` là undefined và `b` là mảng rỗng, coi như không khác nhau
    return !(a === undefined && isEmpty(b));
  }

  // Kiểm tra nếu b là đối tượng
  if (isObject(b)) {
    if (isObject(a)) {
      for (const key in b) {
        // Kiểm tra nếu giá trị của b[key] là undefined, mảng rỗng, hoặc đối tượng rỗng
        if (
          // @ts-ignore
          b[key] === undefined ||
          // @ts-ignore
          (isObject(b[key]) && isEmptyOrUndefinedObject(b[key])) ||
          // @ts-ignore
          (isArray(b[key]) && isEmpty(b[key]))
        ) {
          // Nếu a[key] là undefined hoặc đối tượng rỗng, coi như không khác nhau
          if (
            // @ts-ignore
            a[key] === undefined ||
            // @ts-ignore
            (isArray(a[key]) && isEmpty(a[key])) ||
            // @ts-ignore
            (isObject(a[key]) && isEmptyOrUndefinedObject(a[key]))
          ) {
            continue;
          }
        }

        // So sánh các thuộc tính khác
        // @ts-ignore
        if (isDifferent(a[key], b[key])) {
          // console.log(key, a[key], b[key]);
          return true;
        }
      }
      return false;
    }

    return true;
  }

  // So sánh các giá trị còn lại
  // return (a || b) && a !== b;
  return a !== b;
};
