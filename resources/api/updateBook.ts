import axios from "@/utils/http";
import { i18n } from "@/plugins/i18n";
import type {IBook} from "@/types";

/**
 * Edit book
 *
 * @param id
 * @param bookData
 */
export default (id: number | string, bookData: Omit<IBook, 'id'>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axios.post<any, { token: string }>("/api/tokens/create")
    .then(({ token }) => {

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return axios.put<any, { message: string }>("/api/books/edit/" + id, bookData, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Accept-Language": i18n.global.locale.value, // Current language
          Authorization: 'Bearer ' + token,
        },
        withCredentials: true
      });

    })
