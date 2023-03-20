const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLEnumType,
} = require('graphql');
const ClientModel = require('../model/ClientModel');
const ProjectModel = require('../model/ProjectModel');

const ClientType = new GraphQLObjectType({
  name: 'ClientType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    gender: { type: GraphQLString },
  }),
});

const ProjectType = new GraphQLObjectType({
  name: 'ProjectType',
  fields: () => ({
    id: { type: GraphQLID },
    clientId: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    timetaken: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve: (parent, args) => {
        return ClientModel.findById(parent.clientId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'Rootquerytype',
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve: () => {
        return ClientModel.find();
      },
    },
    client: {
      type: ClientType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return ClientModel.findById(args.id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: () => {
        return ProjectModel.find();
      },
    },
    project: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return ProjectModel.findById(args.id);
      },
    },
  },
});

const Mutations = new GraphQLObjectType({
  name: 'mutations',
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        gender: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        const client = new ClientModel({
          name: args.name,
          email: args.email,
          phone: args.phone,
          gender: args.gender,
        });
        return client.save();
      },
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        ProjectModel.find({ clientId: args.id }).then((projects) => {
          projects.forEach((project) => {
            project.remove();
          });
        });
        return ClientModel.findByIdAndRemove(args.id);
      },
    },
    updateClient: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        gender: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return ClientModel.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              email: args.email,
              phone: args.phone,
              gender: args.gender,
            },
          },
          { new: true }
        );
      },
    },
    addProject: {
      type: ProjectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
        status: {
          type: new GraphQLEnumType({
            name: 'projectstatus',
            values: {
              ideamapping: { value: 'Idea Mapping' },
              notstarted: { value: 'Not Started' },
              inprogress: { value: 'In progress' },
              completed: { value: 'Completed' },
              notsure: { value: 'Not Sure' },
            },
          }),
          default: 'Not Started',
        },
        timetaken: {
          type: new GraphQLEnumType({
            name: 'timetaken',
            values: {
              fivedays: { value: '1-5 days' },
              oneweek: { value: '1 week' },
              twoweeks: { value: '2 weeks' },
              threeweeks: { value: '3 weeks' },
              fourweeks: { value: '4 weeks' },
              onemonth: { value: '1 Month' },
              twomonth: { value: '2 Months' },
            },
          }),
          default: '1-5 days',
        },
      },
      resolve: (parent, args) => {
        const project = new ProjectModel({
          name: args.name,
          description: args.description,
          status: args.status,
          timetaken: args.timetaken,
          clientId: args.clientId,
        });
        return project.save();
      },
    },
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return ProjectModel.findByIdAndRemove(args.id);
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'statusupdates',
            values: {
              ideamapping: { value: 'Idea Mapping' },
              notstarted: { value: 'Not Started' },
              inprogress: { value: 'In progress' },
              completed: { value: 'Completed' },
              notsure: { value: 'Not Sure' },
            },
          }),
          default: 'Not Started',
        },
        timetaken: {
          type: new GraphQLEnumType({
            name: 'timetakenupdates',
            values: {
              fivedays: { value: '1-5 days' },
              oneweek: { value: '1 week' },
              twoweeks: { value: '2 weeks' },
              threeweeks: { value: '3 weeks' },
              fourweeks: { value: '4 weeks' },
              onemonth: { value: '1 Month' },
              twomonth: { value: '2 Months' },
            },
          }),
          default: '1-5 days',
        },
      },
      resolve: (parent, args) => {
        return ProjectModel.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              timetaken: args.timetaken,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
