import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import TopicExtra from '@/components/TopicExtra.vue'

describe('TopicExtra.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(TopicExtra, {
      propsData: { topic: { partitions: [{ partitionId: 'test' }] } }
    })
    expect(wrapper.text()).to.include('partitionId')
  })
})
