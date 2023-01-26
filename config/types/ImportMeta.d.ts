interface ImportMeta {
    env: Env;
}

interface Env {
    PORT:                  number;
    IO_PORT:               number;
    LOCAL_ADDRESS:         string;
    LOCAL_HOST:            string;
    IPV4_ADDRESS:          string;
    IPV4_HOST:             string;
    IO_HOST:               string;
    ROUTER_NAME_HOME_PAGE: string;
    ROUTER_PATH_HOME_PAGE: string;
    GENERAL_GREETING:      string;
    PROJECT_MODE:          string;
    TEST_DATA:             string;
}
