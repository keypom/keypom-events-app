import { IPFS_PINNING_WORKER_URL } from "@/constants/common";
import eventHelperInstance from "../event";

export const getIpfsImageSrcUrl = (cid: string) => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
  const url = `https://${cid}.ipfs.storry.tv`;
  return url;
};

export const pinToIpfs = async (data: File) => {
  const serializedMedia: string = await serializeMediaForWorker(data);
  eventHelperInstance.debugLog(`serializedMedia: ${serializedMedia}`, "log");

  const response = await fetch(`${IPFS_PINNING_WORKER_URL}/pin`, {
    method: "POST",
    body: JSON.stringify({
      fileData: serializedMedia.toString(),
      fileType: data.type,
      fileName: data.name,
    }),
  });
  eventHelperInstance.debugLog(`response: ${response}`, "log");

  if (!response.ok) {
    throw new Error("Access denied");
  }

  const jsonResponse = await response.json();
  eventHelperInstance.debugLog(`jsonResponse: ${jsonResponse}`, "log");
  return jsonResponse.result;
};

export const pinJsonToIpfs = async (jsonToPin: {}) => {
  const response = await fetch(`${IPFS_PINNING_WORKER_URL}/pin-json`, {
    method: "POST",
    body: JSON.stringify({ ...jsonToPin }),
  });
  eventHelperInstance.debugLog(`response: ${response}`, "log");

  if (!response.ok) {
    throw new Error("Access denied");
  }

  const jsonResponse = await response.json();
  eventHelperInstance.debugLog(`jsonResponse: ${jsonResponse}`, "log");
  return jsonResponse.result;
};

export async function serializeMediaForWorker(file: File) {
  const arrayBuffer = await fileToArrayBuffer(file);
  return arrayBufferToBase64(arrayBuffer);
}

async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return await new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new TypeError("The provided value is not a File."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      // Explicitly assert the result is an ArrayBuffer
      resolve(event.target!.result as ArrayBuffer);
    };
    reader.onerror = (event: ProgressEvent<FileReader>) => {
      // Safely access error code, considering it could be null
      reject(
        new Error(
          "File reading error: " +
            (event.target?.error?.message || "Unknown error"),
        ),
      );
    };
    reader.readAsArrayBuffer(file);
  });
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
