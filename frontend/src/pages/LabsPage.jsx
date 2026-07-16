import React from 'react';
import { useOutletContext } from 'react-router-dom';
import LabsView from '../features/labs/LabsView';

export default function LabsPage() {
  const context = useOutletContext();

  return (
    <LabsView
      isActive={true}
      labsConfig={context.labsConfig}
      onChangeLabsConfig={context.handleLabsConfigChange}
    />
  );
}
