FROM node:8

RUN mkdir /stuff
WORKDIR /stuff

COPY package.json .
COPY package-lock.json .

RUN git clone https://github.com/papyrusglobal/papyrus-bridge-contracts.git

RUN mkdir submodules && \
  mv papyrus-bridge-contracts submodules && \
  cd submodules/papyrus-bridge-contracts && \
  git fetch && \
  git checkout 2.1.0

RUN npm install --unsafe-perm

RUN cd submodules/papyrus-bridge-contracts && \
  npm install && \
  ./node_modules/.bin/truffle compile && \
  cd deploy && \
  npm install

ADD . .


CMD ["npm", "start"]
