import { createContainer } from 'unstated-next';

function useCsrfToken(token?: string) {
    return token;
}

const CsrfTokenState = createContainer(useCsrfToken);

export default CsrfTokenState;
