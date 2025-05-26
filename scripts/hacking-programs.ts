import { NS } from "@ns";

export interface HackingProgramDetail {
  name: string,
  functionName: (host: string) => boolean,
  executableName: string
}

export function buildHackingProgramList(ns: NS): HackingProgramDetail[] {
  return [
    { name: 'brute-ssh', functionName: ns.brutessh, executableName: "BruteSSH.exe" },
    { name: 'ftp-crack', functionName: ns.ftpcrack, executableName: "FTPCrack.exe" },
    { name: 'relay-smtp', functionName: ns.relaysmtp, executableName: "relaySMTP.exe" },
    { name: 'http-worm', functionName: ns.httpworm, executableName: "HTTPWorm.exe" },
    { name: 'sql-inject', functionName: ns.sqlinject, executableName: "SQLInject.exe" }
  ];
}

export function listAvailablePrograms(ns: NS, hackingPrograms: HackingProgramDetail[]): HackingProgramDetail[] {
  let availablePrograms = [];
  for (const program of hackingPrograms) {
    if (ns.fileExists(program.executableName, "home")) {
      availablePrograms.push(program);
    }
  }
  return availablePrograms;
}

export function countAvailablePrograms(ns: NS, hackingPrograms: HackingProgramDetail[]): number {
  const availablePrograms = listAvailablePrograms(ns, hackingPrograms);
  return availablePrograms.length;
}
