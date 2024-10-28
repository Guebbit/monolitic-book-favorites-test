import axios from "@/utils/http";
import { i18n } from "@/plugins/i18n";
import type {IBook} from "@/types";

/**
 * Create new book
 *
 * @param bookData
 */
export default (bookData: Omit<IBook, 'id'>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axios.post<any, { token: string }>("/api/tokens/create")
    .then(({ token }) => {

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return axios.put<any, { id: number }>("/api/books/create", bookData, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Accept-Language": i18n.global.locale.value, // Current language
          Authorization: 'Bearer ' + token,
        },
        withCredentials: true
      });

    })
