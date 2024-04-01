import MdRenderer from '@/components/MdRenderer'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { Proposal } from '@/server/opengov/mapper'

export type ProposalDetailModalProps = ModalFunctionalityProps & {
  proposal: Proposal
}

export default function ProposalDetailModal({
  proposal,
  ...props
}: ProposalDetailModalProps) {
  return (
    <Modal {...props} size='screen-md' withCloseButton>
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>
          #{proposal.id} &middot; {proposal.title}
        </h1>
        <MdRenderer className='max-w-none' source={proposal.content} />
      </div>
    </Modal>
  )
}
