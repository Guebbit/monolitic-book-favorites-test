import axios from "@/utils/http";
import { i18n } from "@/plugins/i18n";

/**
 * Add to favorites
 *
 * @param id
 */
export default (id: number | string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axios.post<any, { token: string }>("/api/tokens/create")
    .then(({ token }) => {

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return axios.delete<any, { message: string }>("/api/books/delete/" + id, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Accept-Language": i18n.global.locale.value, // Current language
          Authorization: 'Bearer ' + token,
        },
        withCredentials: true
      });

    })
