FROM nginx
LABEL author="yiuman"

COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

#1.build
#docker build -t bpmn-activiti .
#2.run
#docker run --name bpmn-activiti -p 18080:80 -d --rm  bpmn-activiti
