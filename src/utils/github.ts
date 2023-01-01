import { apiUrls, descriptionUrls } from "@data/urls";
import { Database } from "@redux/interfaces";
import { decode, encode } from "js-base64";
import { getLoginDetails } from "./getLogin";
import { sendMessage } from "./sendMessage";

export interface GithubJsonResponse {
  content: string;
  sha: string;
}

export interface GithubGetResponse {
  content: string | object;
  sha: string;
}

export async function githubGet(
  location: keyof typeof apiUrls
): Promise<GithubGetResponse | string> {
  const url = apiUrls[location] + "?ref=converter";
  const login = getLoginDetails();
  if (login === null) {
    return "Login details missing";
  }

  const resp = await fetch(url, {
    method: "GET",
    mode: "cors",
    headers: {
      authorization: `token ${decode(login.password)}`,
      accept: "application/vnd.github+json",
    },
  });

  if (resp.status !== 200) {
    return "Something went wrong while downloading";
  }

  const respJson: GithubJsonResponse = await resp.json();

  if (!respJson.content) {
    const rawResp = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        authorization: `token ${decode(login.password)}`,
        accept: "application/vnd.github.raw+json",
      },
    });

    if (rawResp.status !== 200) {
      return "Something went wrong while downloading raw media type";
    }

    const rawRespJson: object = await rawResp.json();

    return {
      content: rawRespJson,
      sha: respJson.sha,
    };
  }

  return {
    content: decode(respJson.content),
    sha: respJson.sha,
  };
}

export interface DataToSend {
  sha: string;
  content: string;
}
export async function githubPut(
  location: keyof typeof apiUrls,
  data: DataToSend,
  retries: number = 0
): Promise<true | string> {
  const url = apiUrls[location];
  const login = getLoginDetails();
  if (login === null) {
    return "Login details missing";
  }

  const resp = await fetch(url, {
    method: "PUT",
    mode: "cors",
    headers: {
      authorization: `token ${decode(login.password)}`,
      accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      sha: data.sha,
      branch: "converter",
      message: `Updated by ${login.username}`,
      content: encode(`${data.content}\n`),
    }),
  });

  if (resp.status !== 200) {
    if (retries < 4) {
      sendMessage("Failed upload retrying", "error");
      return githubPut(location, data, retries + 1);
    }
    return "Giving up failed 5 times";
  }
  return true;
}

const unauthorized = async (location: keyof typeof descriptionUrls) => {
  const url = descriptionUrls[location] + "?ref=converter";
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
  });
  const json: Database = await response.json();
  return json;
};

export async function getStartUpDescriptions() {
  const resp = await Promise.all([
    unauthorized("clovis"),
    unauthorized("iceWithEditor"),
  ]);
  return {
    intermediate: resp[0],
    live: resp[1],
  };
}
