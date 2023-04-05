import responseJson from './response-json';
import status from 'http-status-codes';
import { Response } from 'express';
/**
 * HTTP 응답 클래스
 * - 컨트롤러 함수에서 리턴을 하면 응답 데이터 형식에 맞게 응답한다.
 *
 * @see TransformationInterceptor
 */

export default class HttpResponse {
  static ok<T>(res: Response, body?: T): Response<unknown> {
    return res.status(status.OK).json(responseJson(status.OK, body));
  }

  static created<T>(
    res: Response,
    params?: { uri?: string; body?: T },
  ): Response<unknown> {
    if (params && params.uri) {
      res.setHeader('Location', params.uri);
    }
    return res
      .status(status.CREATED)
      .json(responseJson(status.CREATED, params ? params.body : undefined));
  }

  static noContent(res: Response): Response<unknown> {
    return res.status(status.OK).json();
  }

  static badRequest<T>(res: Response, object?: T | Error): Response<unknown> {
    return res
      .status(status.BAD_REQUEST)
      .json(responseJson(status.BAD_REQUEST, object));
  }

  static unauthorized<T>(res: Response, object?: T | Error): Response<unknown> {
    return res
      .status(status.UNAUTHORIZED)
      .json(responseJson(status.UNAUTHORIZED, object));
  }

  static notFound<T>(res: Response, object?: T | Error): Response<unknown> {
    return res
      .status(status.NOT_FOUND)
      .json(responseJson(status.NOT_FOUND, object));
  }

  static unprocessableEntity<T>(
    res: Response,
    object?: T | Error,
  ): Response<unknown> {
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json(responseJson(status.UNPROCESSABLE_ENTITY, object));
  }

  static internalServerError<T>(
    res: Response,
    object?: T | Error,
  ): Response<unknown> {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(responseJson(status.INTERNAL_SERVER_ERROR, object));
  }
}

// export default class HttpResponse<T> {
//   statusCode: number;
//   _body: { status: number; message: string; result?: unknown | T };
//   _headers: object;

//   constructor(statusCode: number, body?: T) {
//     this.statusCode = statusCode;
//     this._body = responseJson(statusCode, body);
//   }

//   body(body: T) {
//     this._body = responseJson(this.statusCode, body);
//   }

//   headers(headers: object) {
//     this._headers = {
//       ...this._headers,
//       ...headers,
//     };
//     return this;
//   }

//   static ok<T>(body?: T) {
//     return new HttpResponse(200, body);
//   }

//   static created<T>(params?: { uri?: string; body?: T }) {
//     const httpResponse = new HttpResponse(201, params?.body);
//     if (params?.uri) {
//       httpResponse._headers = {
//         Location: params.uri,
//       };
//     }
//     return httpResponse;
//   }

//   static noContent() {
//     return new HttpResponse(204);
//   }
// }
