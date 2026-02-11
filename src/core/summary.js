import * as p from '@clack/prompts';

/**
 * Demande confirmation pour générer le projet
 * (Le récapitulatif est déjà affiché en haut dans "Vos choix")
 */
export async function showSummaryAndConfirm(config) {
  // Demander confirmation
  const confirmed = await p.confirm({
    message: 'Confirmer et générer le projet ?',
    initialValue: true
  });

  if (p.isCancel(confirmed)) {
    p.cancel('Installation annulée.');
    return 'cancel';
  }

  if (!confirmed) {
    const action = await p.select({
      message: 'Que souhaitez-vous faire ?',
      options: [
        { value: 'restart', label: 'Recommencer la configuration' },
        { value: 'cancel', label: 'Annuler et quitter' }
      ]
    });

    if (p.isCancel(action)) {
      p.cancel('Installation annulée.');
      return 'cancel';
    }

    return action;
  }

  return 'confirmed';
}
