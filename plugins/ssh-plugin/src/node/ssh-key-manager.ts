/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { IRemoteAPI } from '@eclipse-che/workspace-client';
import { che as cheApi } from '@eclipse-che/api';


/**
 * Simple SSH key pairs manager that performs basic operations like create,
 * get, delete, etc. There is no restriction on the way the keys are obtained -
 * remotely (via REST or JSON-RPC, ) or locally (e.g. dynamically generated
 * and/or in-memory stored), so the implementation of the interface defines
 * the mechanism that is used.
 */
export interface SshKeyManager {

    /**
     * Generate an SSH key pair for specified service and name
     *
     * @param {string} service the name of the service that is associated with
     * the SSH key pair
     * @param {string} name the identifier of the key pair
     *
     * @returns {Promise<SshKeyPair>}
     */
    generate(service: string, name: string): Promise<cheApi.ssh.SshPair>;

    /**
     * Create a specified SSH key pair
     *
     * @param {SshKeyPair} sshKeyPair the SSH key pair that is to be created
     *
     * @returns {Promise<void>}
     */
    create(sshKeyPair: cheApi.ssh.SshPair): Promise<void>;

    /**
     * Get all SSH key pairs associated with specified service
     *
     * @param {string} service the name of the service that is associated with
     * the SSH key pair
     *
     * @returns {Promise<cheApi.ssh.SshPair[]>}
     */
    getAll(service: string): Promise<cheApi.ssh.SshPair[]>;

    /**
     * Get an SSH key pair associated with specified service and name
     *
     * @param {string} service the name of the service that is associated with
     * the SSH key pair
     * @param {string} name the identifier of the key pair
     *
     * @returns {Promise<cheApi.ssh.SshPair>}
     */
    get(service: string, name: string): Promise<cheApi.ssh.SshPair>;

    /**
     * Delete an SSH key pair with a specified service and name
     *
     * @param {string} service the name of the service that is associated with
     * the SSH key pair
     * @param {string} name the identifier of the key pair
     *
     * @returns {Promise<void>}
     */
    delete(service: string, name: string): Promise<void>;
}

export interface CheService {
    name: string,
    displayName: string,
    description: string
}

/**
 * A remote SSH key paris manager that uses {@link SshKeyServiceClient} for
 * all SHH key related operations.
 */
export class RemoteSshKeyManager implements SshKeyManager {

    constructor(protected readonly sshKeyServiceClient: IRemoteAPI) {
    }

    /**
     * @inheritDoc
     */
    generate(service: string, name: string): Promise<cheApi.ssh.SshPair> {
        return new Promise<cheApi.ssh.SshPair>((resolve, reject) => {
            this.sshKeyServiceClient
                .generateSshKey(service, name)
                .then(value => resolve(value))
                .catch(reason => reject(reason));
        });
    }

    /**
     * @inheritDoc
     */
    create(sshKeyPair: cheApi.ssh.SshPair): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.sshKeyServiceClient
                .createSshKey(sshKeyPair)
                .then(value => resolve(value))
                .catch(reason => reject(reason));
        });
    }

    /**
     * @inheritDoc
     */
    getAll(service: string): Promise<cheApi.ssh.SshPair[]> {
        return new Promise<cheApi.ssh.SshPair[]>((resolve, reject) =>
            this.sshKeyServiceClient
                .getAllSshKey(service)
                .then(value => resolve(value))
                .catch(reason => reject(reason)));
    }

    /**
     * @inheritDoc
     */
    get(service: string, name: string): Promise<cheApi.ssh.SshPair> {
        return new Promise<cheApi.ssh.SshPair>((resolve, reject) =>
            this.sshKeyServiceClient
                .getSshKey(service, name)
                .then(value => resolve(value))
                .catch(reason => reject(reason)));
    }

    /**
     * @inheritDoc
     */
    delete(service: string, name: string): Promise<void> {
        return new Promise<void>((resolve, reject) =>
            this.sshKeyServiceClient
                .deleteSshKey(service, name)
                .then(value => resolve(value))
                .catch(reason => reject(reason)));
    }
}
