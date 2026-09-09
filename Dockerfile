FROM node:18-bullseye-slim

# Install Python and dependencies required for PDF generation
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install reportlab pandas matplotlib

# Setup Node.js app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Run tests by default (can be overridden)
CMD ["npm", "run", "demo"]
