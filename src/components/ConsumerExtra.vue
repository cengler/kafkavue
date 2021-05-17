<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :headers="headers"
          :items="consumer.members"
        >
          <template v-slot:item.memberAssignment="{ item }">
            {{ decodeMA(item.memberAssignment) }}
          </template>
          <template v-slot:item.memberMetadata="{ item }">
            {{ decodeMM(item.memberMetadata) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script type="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { AssignerProtocol } from 'kafkajs'

@Component({ inheritAttrs: true })
export default class TopicExtra extends Vue {
  @Prop({ required: true })
  consumer

  headers = [
    {
      text: 'clientHost',
      value: 'clientHost'
    },
    {
      text: 'clientId',
      value: 'clientId'
    },
    /* {
      text: 'memberId',
      value: 'memberId'
    }, */
    {
      text: 'memberAssignment',
      value: 'memberAssignment'
    },
    {
      text: 'memberMetadata',
      value: 'memberMetadata'
    }
  ]

  decodeMA (memberAssignment) {
    const assignment = AssignerProtocol.MemberAssignment.decode(memberAssignment).assignment
    return Object.keys(assignment)[0] + ':' + assignment[Object.keys(assignment)[0]]
  }

  decodeMM (memberMetadata) {
    return AssignerProtocol.MemberMetadata.decode(memberMetadata).topics[0]
  }
}

</script>
